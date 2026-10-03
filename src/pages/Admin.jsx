import { useState, useEffect, useRef } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { db } from '../utils/firebase';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { initializeContent, saveContent, resetContent } from '../utils/storage';
import { PROJECT_CATEGORIES } from '../data/projectCategories';
import './Admin.css';

function isImageFile(file) {
  return file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i.test(file.name || '');
}

function isVideoFile(file) {
  return file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name || '');
}

function asMedia(item) {
  return typeof item === 'string' ? { src: item } : { ...(item || {}) };
}

function sortAndNormalize(list) {
  const items = Array.isArray(list) ? list : [];
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ao = typeof a.item === 'string' ? a.index + 1 : (Number(a.item?.order) || a.index + 1);
      const bo = typeof b.item === 'string' ? b.index + 1 : (Number(b.item?.order) || b.index + 1);
      return ao - bo || a.index - b.index;
    })
    .map(({ item }, i) => ({ ...asMedia(item), order: i + 1 }));
}

function moveInList(list, index, dir) {
  const next = [...(list || [])];
  const target = index + dir;
  if (target < 0 || target >= next.length) return sortAndNormalize(next);
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next.map((entry, i) => ({ ...asMedia(entry), order: i + 1 }));
}

function withOrderedProjects(projects) {
  return (projects || []).map(project => ({
    ...project,
    images: sortAndNormalize(project.images),
    videos: sortAndNormalize(project.videos)
  }));
}

function shortUploadError(err) {
  const raw = String(err?.message || '');
  const jsonStart = raw.indexOf('{');
  if (jsonStart >= 0) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart));
      if (parsed?.error?.message) return parsed.error.message;
    } catch {
      /* use the raw message below */
    }
  }
  return raw.replace(/^Cloudinary upload failed:\s*\d+\s*/, '').slice(0, 180) || 'could not be uploaded';
}

function FilePicker({ label, accept, disabled, onPick }) {
  return (
    <label className={`upload-btn file-picker ${disabled ? 'is-disabled' : ''}`}>
      {label}
      <input
        type="file"
        accept={accept}
        multiple
        disabled={disabled}
        onChange={(e) => {
          const picked = Array.from(e.target.files || []);
          e.target.value = '';
          if (picked.length) onPick(picked);
        }}
      />
    </label>
  );
}

function Admin() {
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState('siteInfo');
  const [saveStatus, setSaveStatus] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dragRef = useRef({ projectId: null, index: null });
  const [lastCreatedProjectId, setLastCreatedProjectId] = useState(null);
  const createBlankDraft = () => ({
    tempId: Date.now() + Math.floor(Math.random() * 1000),
    title: '',
    category: 'residential',
    description: '',
    location: '',
    year: new Date().getFullYear().toString(),
    status: 'completed',
    designScope: '',
    images: [],
    videos: []
  });
  const [newProjectForms, setNewProjectForms] = useState([createBlankDraft()]);
  const [editingProjectIds, setEditingProjectIds] = useState({});
  const [uploadingKey, setUploadingKey] = useState('');
  const [uploadNote, setUploadNote] = useState(null);

  // Simple password protection (in production, use proper authentication)
  const ADMIN_PASSWORD = 'Vastuvriksha@2025';

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      initializeContent().then(async (data) => {
        // Load existing projects from Firestore so Admin sees global data
        try {
          const snap = await getDocs(collection(db, 'projects'));
          const projects = withOrderedProjects(snap.docs.map(d => ({ id: d.data()?.id ?? d.id, ...d.data() })));
          setContent({ ...data, projects });
        } catch (e) {
          setContent(data);
        }
      });
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      initializeContent().then(async (data) => {
        try {
          const snap = await getDocs(collection(db, 'projects'));
          const projects = withOrderedProjects(snap.docs.map(d => ({ id: d.data()?.id ?? d.id, ...d.data() })));
          setContent({ ...data, projects });
        } catch (e) {
          setContent(data);
        }
      });
    } else {
      alert('Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
  };

  const handleSave = () => {
    if (saveContent(content)) {
      setSaveStatus('success');
      window.dispatchEvent(new Event('contentUpdate'));
      // Persist all projects to Firestore (upsert by id)
      try {
        (content.projects || []).forEach(async (p) => {
          const pid = String(p.id || Date.now());
          await setDoc(doc(db, 'projects', pid), { ...p, id: p.id || Number(pid) });
        });
      } catch (e) {
        console.error('Error syncing projects to Firestore', e);
      }
      // No auto form duplication
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to default? This cannot be undone.')) {
      resetContent().then(data => {
        setContent(data);
        window.dispatchEvent(new Event('contentUpdate'));
        alert('Content reset to default successfully!');
      });
    }
  };

  const updateSiteInfo = (field, value) => {
    setContent({
      ...content,
      siteInfo: {
        ...content.siteInfo,
        [field]: value
      }
    });
  };

  const updateSocialMedia = (platform, value) => {
    setContent({
      ...content,
      siteInfo: {
        ...content.siteInfo,
        socialMedia: {
          ...content.siteInfo.socialMedia,
          [platform]: value
        }
      }
    });
  };

  const updateHero = (field, value) => {
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: value
      }
    });
  };

  const updateAbout = (field, value) => {
    setContent({
      ...content,
      about: {
        ...content.about,
        [field]: value
      }
    });
  };

  const updateStat = (id, field, value) => {
    setContent({
      ...content,
      about: {
        ...content.about,
        stats: content.about.stats.map(stat =>
          stat.id === id ? { ...stat, [field]: value } : stat
        )
      }
    });
  };

  const addService = () => {
    const newService = {
      id: Date.now(),
      title: '',
      description: '',
      icon: '⭐'
    };
    setContent({
      ...content,
      services: [...content.services, newService]
    });
  };

  const updateService = (id, field, value) => {
    setContent({
      ...content,
      services: content.services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    });
  };

  const deleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setContent({
        ...content,
        services: content.services.filter(service => service.id !== id)
      });
    }
  };

  const addProject = () => {
    const newId = Date.now();
    const newProject = {
      id: newId,
      title: '',
      category: 'residential',
      description: '',
      image: '',
      location: '',
      year: new Date().getFullYear().toString(),
      status: 'completed',
      designScope: '',
      images: [],
      videos: []
    };
    setContent({
      ...content,
      projects: [...content.projects, newProject]
    });
    setLastCreatedProjectId(newId);
  };

  const updateProject = (id, field, value) => {
    setContent({
      ...content,
      projects: content.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setContent({
        ...content,
        projects: content.projects.filter(project => project.id !== id)
      });
      // Delete from Firestore
      deleteDoc(doc(db, 'projects', String(id))).catch(()=>{});
    }
  };

  const addProjectImage = (projectId) => {
    const project = content.projects.find(p => p.id === projectId);
    const nextOrder = (project?.images?.length || 0) + 1;
    setContent({
      ...content,
      projects: content.projects.map(p => p.id === projectId
        ? { ...p, images: [...(p.images || []), { src: '', order: nextOrder }] }
        : p
      )
    });
  };

  // New Project form helpers
  const addNewProjectImage = () => {
    setNewProject(prev => ({
      ...prev,
      images: [...(prev.images || []), { src: '', order: (prev.images?.length || 0) + 1 }]
    }));
  };

  const updateNewProjectImage = (index, field, value) => {
    setNewProject(prev => {
      const images = [...(prev.images || [])];
      const img = images[index] || { src: '', order: index + 1 };
      images[index] = { ...img, [field]: field === 'order' ? Number(value) : value };
      return { ...prev, images };
    });
  };

  const removeNewProjectImage = (index) => {
    setNewProject(prev => {
      const images = [...(prev.images || [])];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const moveNewProjectImage = (index, dir) => {
    setNewProject(prev => {
      const images = [...(prev.images || [])];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= images.length) return prev;
      const tmp = images[index];
      images[index] = images[newIndex];
      images[newIndex] = tmp;
      const normalized = images.map((im, i) => ({ ...im, order: i + 1 }));
      return { ...prev, images: normalized };
    });
  };

  const handleNewProjectImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please upload an image (jpg, png, webp).'); return; }
    if (file.size > 40 * 1024 * 1024) { alert('Image too large. Max 40MB. A 20MB photo is reduced automatically.'); return; }
    uploadImageToCloudinary(file)
      .then(url => updateNewProjectImage(index, 'src', url))
      .catch(() => {
        const reader = new FileReader();
        reader.onloadend = () => updateNewProjectImage(index, 'src', reader.result);
        reader.readAsDataURL(file);
      });
  };

  const saveNewProject = () => {
    if (!newProject.title || newProject.title.trim() === '') {
      alert('Please enter a project title.');
      return;
    }
    const projectToAdd = {
      id: Date.now(),
      title: newProject.title.trim(),
      category: newProject.category,
      description: newProject.description,
      location: newProject.location,
      year: newProject.year,
      status: newProject.status,
      images: (newProject.images || []).map((im, i) => ({ src: im.src, order: im.order ?? (i + 1) }))
    };
    const updated = { ...content, projects: [...(content.projects || []), projectToAdd] };
    setContent(updated);
    if (saveContent(updated)) {
      window.dispatchEvent(new Event('contentUpdate'));
      setSaveStatus('success');
      // Clear form
      setNewProject({
        title: '', category: 'residential', description: '', location: '', year: new Date().getFullYear().toString(), status: 'completed', images: []
      });
      // Keep the form visible for adding another; do not replace existing items
      setTimeout(() => setSaveStatus(''), 2000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const updateProjectImage = (projectId, index, field, value) => {
    setContent({
      ...content,
      projects: content.projects.map(p => {
        if (p.id !== projectId) return p;
        const images = [...(p.images || [])];
        const img = images[index] || { src: '', order: index + 1 };
        images[index] = { ...img, [field]: field === 'order' ? Number(value) : value };
        return { ...p, images };
      })
    });
  };

  const removeProjectImage = (projectId, index) => {
    setContent({
      ...content,
      projects: content.projects.map(p => {
        if (p.id !== projectId) return p;
        const images = [...(p.images || [])];
        images.splice(index, 1);
        return { ...p, images };
      })
    });
  };

  const moveProjectImage = (projectId, index, dir) => {
    setContent({
      ...content,
      projects: content.projects.map(p => {
        if (p.id !== projectId) return p;
        const images = [...(p.images || [])];
        const newIndex = index + dir;
        if (newIndex < 0 || newIndex >= images.length) return p;
        const tmp = images[index];
        images[index] = images[newIndex];
        images[newIndex] = tmp;
        // normalize order values to current positions starting at 1
        const normalized = images.map((im, i) => ({ ...im, order: (i + 1) }));
        return { ...p, images: normalized };
      })
    });
  };

  const runUploads = async (key, files, kind, onUrl) => {
    const max = kind === 'video' ? 100 * 1024 * 1024 : 40 * 1024 * 1024;
    const limitLabel = kind === 'video' ? '100MB' : '40MB';
    const errors = [];
    let done = 0;
    setUploadingKey(key);
    setUploadNote({ key, text: `Uploading ${files.length} file${files.length === 1 ? '' : 's'}… keep this page open.`, isError: false });
    try {
      for (const file of files) {
        const okType = kind === 'video' ? isVideoFile(file) : isImageFile(file);
        if (!okType) {
          errors.push(`${file.name} is not a ${kind}.`);
          continue;
        }
        if (file.size > max) {
          errors.push(`${file.name} is larger than ${limitLabel}.`);
          continue;
        }
        try {
          if (kind === 'image' && file.size > 9.5 * 1024 * 1024) {
            setUploadNote({ key, text: `Preparing a high-quality copy of ${file.name}…`, isError: false });
          }
          const url = await uploadImageToCloudinary(file);
          done += 1;
          onUrl(url);
          setUploadNote({ key, text: `Uploaded ${done} of ${files.length}…`, isError: false });
        } catch (err) {
          errors.push(`${file.name}: ${shortUploadError(err)}`);
        }
      }
      if (errors.length) {
        setUploadNote({ key, text: errors.join(' '), isError: true });
      } else if (done) {
        setUploadNote({ key, text: `${done} uploaded. Use Up and Down to set the order, then click Save.`, isError: false });
      }
    } finally {
      setUploadingKey('');
    }
  };

  const appendDraftMedia = (formIdx, field, urls) => {
    if (!urls.length) return;
    setNewProjectForms(fs => fs.map((f, i) => {
      if (i !== formIdx) return f;
      const current = Array.isArray(f[field]) ? f[field] : [];
      const added = urls.map((src, n) => ({ src, order: current.length + n + 1 }));
      return { ...f, [field]: [...current, ...added] };
    }));
  };

  const handleDraftPicked = (formIdx, field, files) => {
    runUploads(`draft-${formIdx}-${field}`, files, field === 'videos' ? 'video' : 'image', (url) => {
      appendDraftMedia(formIdx, field, [url]);
    });
  };

  const appendProjectMedia = (projectId, field, urls) => {
    if (!urls.length) return;
    setContent(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => {
        if (p.id !== projectId) return p;
        const next = sortAndNormalize([...(p[field] || []), ...urls.map(src => ({ src }))]);
        setDoc(doc(db, 'projects', String(p.id)), { [field]: next }, { merge: true }).catch(() => {});
        return { ...p, [field]: next };
      })
    }));
  };

  const moveDraftMedia = (formIdx, field, index, dir) => {
    setNewProjectForms(fs => fs.map((f, i) => (
      i === formIdx ? { ...f, [field]: moveInList(f[field], index, dir) } : f
    )));
  };

  const moveExistingMedia = (projectId, field, index, dir) => {
    setContent(prev => ({
      ...prev,
      projects: (prev.projects || []).map(p => {
        if (p.id !== projectId) return p;
        const next = moveInList(p[field], index, dir);
        setDoc(doc(db, 'projects', String(p.id)), { [field]: next }, { merge: true }).catch(() => {});
        return { ...p, [field]: next };
      })
    }));
  };

  const handleExistingPicked = (projectId, field, files) => {
    runUploads(`project-${projectId}-${field}`, files, field === 'videos' ? 'video' : 'image', (url) => {
      appendProjectMedia(projectId, field, [url]);
    });
  };

  const removeProjectVideo = (projectId, index) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const videos = sortAndNormalize((p.videos || []).filter((_, i) => i !== index));
        setDoc(doc(db, 'projects', String(p.id)), { videos }, { merge: true }).catch(() => {});
        return { ...p, videos };
      })
    }));
  };

  const handleProjectImageUpload = (projectId, index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (!isImage) { alert('Please upload an image (jpg, png, webp).'); return; }
    const maxBytes = 40 * 1024 * 1024;
    if (file.size > maxBytes) { alert('Image too large. Max 40MB. A 20MB photo is reduced automatically.'); return; }
    // Try Cloudinary first
    uploadImageToCloudinary(file)
      .then(url => { updateProjectImage(projectId, index, 'src', url); })
      .catch(() => {
        // Fallback to local base64 for images
        const reader = new FileReader();
        reader.onloadend = () => { updateProjectImage(projectId, index, 'src', reader.result); };
        reader.readAsDataURL(file);
      });
  };

  const handleImageDragStart = (projectId, index) => {
    dragRef.current = { projectId, index };
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageDrop = (projectId, dropIndex) => {
    const { projectId: fromProjectId, index: fromIndex } = dragRef.current || {};
    if (fromProjectId !== projectId || fromIndex === null || fromIndex === dropIndex) return;
    setContent(prev => {
      const copy = { ...prev };
      const projIdx = copy.projects.findIndex(p => p.id === projectId);
      if (projIdx === -1) return prev;
      const images = [...(copy.projects[projIdx].images || [])];
      const [moved] = images.splice(fromIndex, 1);
      images.splice(dropIndex, 0, moved);
      const normalized = images.map((im, i) => ({ ...(typeof im === 'string' ? { src: im } : im), order: i + 1 }));
      copy.projects[projIdx] = { ...copy.projects[projIdx], images: normalized };
      return copy;
    });
    dragRef.current = { projectId: null, index: null };
  };

  const handleImageUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB. Please use a smaller image or compress it.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (jpg, png, etc.)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateProject(id, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1>Admin Login</h1>
          <p>Enter password to access admin panel</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          {/* <div className="login-hint">
            <small>Default password: vastuvriksha2024</small>
          </div> */}
        </div>
      </div>
    );
  }

  if (!content) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Panel</h1>
          <div className="admin-actions">
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Save Status */}
        {saveStatus && (
          <div className={`save-status ${saveStatus}`}>
            {saveStatus === 'success' ? '✅ Changes saved successfully!' : '❌ Error saving changes'}
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'siteInfo' ? 'active' : ''}`}
            onClick={() => setActiveTab('siteInfo')}
          >
            Site Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            Hero Section
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {/* Site Info Tab */}
          {activeTab === 'siteInfo' && (
            <div className="tab-content">
              <h2>Site Information</h2>
              
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={content.siteInfo.companyName}
                      onChange={(e) => updateSiteInfo('companyName', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Tagline</label>
                    <input
                      type="text"
                      value={content.siteInfo.tagline}
                      onChange={(e) => updateSiteInfo('tagline', e.target.value)}
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Description</label>
                    <textarea
                      value={content.siteInfo.description}
                      onChange={(e) => updateSiteInfo('description', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Details</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={content.siteInfo.email}
                      onChange={(e) => updateSiteInfo('email', e.target.value)}
                      placeholder="info@vastuvriksha.com"
                    />
                  </div>
                  <div className="form-field">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={content.siteInfo.phone}
                      onChange={(e) => updateSiteInfo('phone', e.target.value)}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Address</label>
                    <textarea
                      value={content.siteInfo.address}
                      onChange={(e) => updateSiteInfo('address', e.target.value)}
                      rows="2"
                      placeholder="Your business address"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Social Media Links</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Facebook URL</label>
                    <input
                      type="url"
                      value={content.siteInfo.socialMedia.facebook}
                      onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="form-field">
                    <label>Instagram URL</label>
                    <input
                      type="url"
                      value={content.siteInfo.socialMedia.instagram}
                      onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div className="form-field">
                    <label>LinkedIn URL</label>
                    <input
                      type="url"
                      value={content.siteInfo.socialMedia.linkedin}
                      onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div className="form-field">
                    <label>Twitter URL</label>
                    <input
                      type="url"
                      value={content.siteInfo.socialMedia.twitter}
                      onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <div className="tab-content">
              <h2>Hero Section</h2>
              
              <div className="form-section">
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Main Title</label>
                    <input
                      type="text"
                      value={content.hero.title}
                      onChange={(e) => updateHero('title', e.target.value)}
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={content.hero.subtitle}
                      onChange={(e) => updateHero('subtitle', e.target.value)}
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Description</label>
                    <textarea
                      value={content.hero.description}
                      onChange={(e) => updateHero('description', e.target.value)}
                      rows="3"
                    />
                  </div>
                  <div className="form-field">
                    <label>Button Text</label>
                    <input
                      type="text"
                      value={content.hero.ctaText}
                      onChange={(e) => updateHero('ctaText', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Button Link</label>
                    <input
                      type="text"
                      value={content.hero.ctaLink}
                      onChange={(e) => updateHero('ctaLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="tab-content">
              <h2>About Section</h2>
              
              <div className="form-section">
                <h3>About Content</h3>
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Title</label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) => updateAbout('title', e.target.value)}
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Description</label>
                    <textarea
                      value={content.about.description}
                      onChange={(e) => updateAbout('description', e.target.value)}
                      rows="4"
                      placeholder="Tell your story..."
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Mission Statement</label>
                    <textarea
                      value={content.about.mission}
                      onChange={(e) => updateAbout('mission', e.target.value)}
                      rows="3"
                      placeholder="Your mission..."
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Vision Statement</label>
                    <textarea
                      value={content.about.vision}
                      onChange={(e) => updateAbout('vision', e.target.value)}
                      rows="3"
                      placeholder="Your vision..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Statistics</h3>
                {content.about.stats.map(stat => (
                  <div key={stat.id} className="form-grid stat-grid">
                    <div className="form-field">
                      <label>Number</label>
                      <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => updateStat(stat.id, 'number', e.target.value)}
                        placeholder="e.g., 100+"
                      />
                    </div>
                    <div className="form-field">
                      <label>Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                        placeholder="e.g., Projects Completed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Services</h2>
                <button onClick={addService} className="btn btn-primary">
                  + Add Service
                </button>
              </div>

              <div className="items-list">
                {content.services.map(service => (
                  <div key={service.id} className="item-card">
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Icon (Emoji)</label>
                        <input
                          type="text"
                          value={service.icon}
                          onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                          maxLength="2"
                        />
                      </div>
                      <div className="form-field">
                        <label>Service Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateService(service.id, 'title', e.target.value)}
                          placeholder="Service name"
                        />
                      </div>
                      <div className="form-field full-width">
                        <label>Description</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          rows="2"
                          placeholder="Service description"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="btn-delete"
                    >
                      Delete Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="tab-content">
              <div className="section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2>Projects</h2>
                <button onClick={() => setNewProjectForms(forms => [...forms, createBlankDraft()])} className="btn btn-primary">
                  + Add New Project
                </button>
              </div>

              {/* Multiple draft forms - each with Save/Clear */}
              {newProjectForms.map((np, formIdx) => (
                <div key={np.tempId} className="form-section" style={{marginBottom: 24}}>
                  <h3>Add New Project</h3>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Project Title</label>
                      <input type="text" value={np.title} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, title: e.target.value}: f))} placeholder="Project name" />
                    </div>
                    <div className="form-field">
                      <label>Category</label>
                      <select value={np.category} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, category: e.target.value}: f))}>
                        {PROJECT_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Location</label>
                      <input type="text" value={np.location} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, location: e.target.value}: f))} placeholder="City, Country" />
                    </div>
                    <div className="form-field">
                      <label>Year</label>
                      <input type="text" value={np.year} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, year: e.target.value}: f))} placeholder="2025" />
                    </div>
                    <div className="form-field">
                      <label>Status</label>
                      <select value={np.status} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, status: e.target.value}: f))}>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>
                    <div className="form-field full-width">
                      <label>Description</label>
                      <textarea rows="3" value={np.description} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, description: e.target.value}: f))} placeholder="Project description" />
                    </div>
                    <div className="form-field full-width">
                      <label>Design Scope</label>
                      <textarea rows="3" value={np.designScope || ''} onChange={(e) => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? {...f, designScope: e.target.value}: f))} placeholder="What this project covers, for example living room, kitchen, and furniture layout" />
                    </div>
                    <div className="form-field full-width">
                      <label>Project Images (ordered)</label>
                      <div className="image-upload-section">
                        <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:12}}>
                          <FilePicker
                            label={uploadingKey === `draft-${formIdx}-images` ? 'Uploading…' : '📁 Select multiple images'}
                            accept="image/*"
                            disabled={Boolean(uploadingKey)}
                            onPick={(files) => handleDraftPicked(formIdx, 'images', files)}
                          />
                          <small style={{color:'#666'}}>A 20MB photo is allowed. If it is over 10MB, a high-quality copy is made so the detail stays sharp. The first photo is shown first.</small>
                        </div>
                        {uploadNote?.key === `draft-${formIdx}-images` && (
                          <p className={uploadNote.isError ? 'upload-error' : 'upload-status'}>{uploadNote.text}</p>
                        )}
                        {(np.images || []).map((img, idx) => (
                          <div key={idx} className="upload-options" style={{alignItems:'center', gap:10, marginBottom:10, border:'1px dashed #e0e0e0', padding:8, borderRadius:6}}>
                            <strong style={{width:28}}>{idx + 1}</strong>
                            {img.src ? <img src={img.src} alt="" style={{width:72, height:54, objectFit:'cover', borderRadius:4}} /> : null}
                            <label className="upload-label">
                              <input type="file" accept="image/*" onChange={(e)=>{
                                const file = e.target.files[0];
                                if (!file) return;
                                if (!file.type.startsWith('image/')) { alert('Please upload an image (jpg, png, webp).'); return; }
                                if (file.size > 40 * 1024 * 1024) { alert('Image too large. Max 40MB. A 20MB photo is reduced automatically.'); return; }
                                uploadImageToCloudinary(file)
                                  .then(url => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, images: f.images.map((m,k)=> k===idx? {...m, src: url}: m) }): f)))
                                  .catch(() => { const reader = new FileReader(); reader.onloadend = () => setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, images: f.images.map((m,k)=> k===idx? {...m, src: reader.result}: m) }): f)); reader.readAsDataURL(file); });
                              }} style={{display:'none'}} />
                              <span className="upload-btn">📁 Upload Image</span>
                            </label>
                            <small style={{color:'#666'}}>JPG, PNG, WEBP. Large photos keep high quality.</small>
                            <input type="url" className="url-input" style={{flex:1}} placeholder="Paste image URL" value={img.src || ''} onChange={(e)=> setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, images: f.images.map((m,k)=> k===idx? {...m, src: e.target.value}: m) }): f))} />
                            <button type="button" className="btn-delete" onClick={() => moveDraftMedia(formIdx, 'images', idx, -1)} disabled={idx===0}>Up</button>
                            <button type="button" className="btn-delete" onClick={() => moveDraftMedia(formIdx, 'images', idx, 1)} disabled={idx===(np.images.length-1)}>Down</button>
                            <button type="button" className="btn-delete" onClick={()=> setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, images: f.images.filter((_,k)=> k!==idx) }): f))}>✕</button>
                          </div>
                        ))}
                        <div style={{marginTop:8}}>
                          <button type="button" className="btn btn-primary" onClick={()=> setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, images: [...(f.images||[]), { src:'', order: (f.images?.length||0)+1 }] }): f))}>+ Add Image</button>
                        </div>
                      </div>
                    </div>
                    <div className="form-field full-width">
                      <label>Project Video</label>
                      <div className="image-upload-section">
                        <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:12}}>
                          <FilePicker
                            label={uploadingKey === `draft-${formIdx}-videos` ? 'Uploading…' : '🎬 Upload video'}
                            accept="video/*"
                            disabled={Boolean(uploadingKey)}
                            onPick={(files) => handleDraftPicked(formIdx, 'videos', files)}
                          />
                          <small style={{color:'#666'}}>You can select more than one video. Use Up and Down to set the order. MP4, WEBM, or MOV, up to 100MB each.</small>
                        </div>
                        {uploadNote?.key === `draft-${formIdx}-videos` && (
                          <p className={uploadNote.isError ? 'upload-error' : 'upload-status'}>{uploadNote.text}</p>
                        )}
                        {(np.videos || []).map((vid, idx) => (
                          <div key={idx} className="upload-options" style={{alignItems:'center', gap:10, marginBottom:10, border:'1px dashed #e0e0e0', padding:8, borderRadius:6}}>
                            <strong style={{width:28}}>{idx + 1}</strong>
                            {vid.src ? <video src={vid.src} controls style={{width:160, height:90, objectFit:'cover', borderRadius:4}} /> : null}
                            <input type="url" className="url-input" style={{flex:1}} placeholder="Video URL" value={vid.src || ''} onChange={(e)=> setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, videos: f.videos.map((m,k)=> k===idx? {...m, src: e.target.value}: m) }): f))} />
                            <button type="button" className="btn-delete" onClick={() => moveDraftMedia(formIdx, 'videos', idx, -1)} disabled={idx===0}>Up</button>
                            <button type="button" className="btn-delete" onClick={() => moveDraftMedia(formIdx, 'videos', idx, 1)} disabled={idx===((np.videos || []).length-1)}>Down</button>
                            <button type="button" className="btn-delete" onClick={()=> setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? ({...f, videos: sortAndNormalize((f.videos||[]).filter((_,k)=> k!==idx)) }): f))}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:12, marginTop:12}}>
                    <button type="button" className="btn btn-primary" onClick={()=>{
                      const npv = newProjectForms[formIdx];
                      if (!npv.title || npv.title.trim() === '') { alert('Please enter a project title.'); return; }
                      const projectToAdd = {
                        id: Date.now(),
                        title: npv.title.trim(),
                        category: npv.category,
                        description: npv.description,
                        designScope: (npv.designScope || '').trim(),
                        location: npv.location,
                        year: npv.year,
                        status: npv.status,
                        images: (npv.images || []).filter(im => im && im.src).map((im, i) => ({ src: im.src, order: im.order ?? (i + 1) })),
                        videos: (npv.videos || []).filter(im => im && im.src).map((im, i) => ({ src: im.src, order: im.order ?? (i + 1) }))
                      };
                      const updated = { ...content, projects: [...(content.projects || []), projectToAdd] };
                      setContent(updated);
                      if (saveContent(updated)) {
                        window.dispatchEvent(new Event('contentUpdate'));
                        // Upsert into Firestore using id as document key
                        setDoc(doc(db, 'projects', String(projectToAdd.id)), projectToAdd).catch(()=>{});
                        setSaveStatus('success');
                        setNewProjectForms(fs => fs.filter((_,i)=> i!==formIdx));
                        setTimeout(()=> setSaveStatus(''), 1500);
                      } else {
                        setSaveStatus('error');
                        setTimeout(()=> setSaveStatus(''), 1500);
                      }
                    }}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={()=> setNewProjectForms(fs => fs.map((f,i)=> i===formIdx? createBlankDraft(): f))}>Clear</button>
                  </div>
                </div>
              ))}

              <div className="items-list">
                {[...(content.projects || [])]
                  .slice()
                  .sort((a,b) => (Number(b.id) || 0) - (Number(a.id) || 0))
                  .map(project => (
                  <div key={project.id} className="item-card">
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="Project name"
                        />
                      </div>
                      <div className="form-field">
                        <label>Category</label>
                        <select
                          value={project.category}
                          onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                        >
                          {PROJECT_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Location</label>
                        <input
                          type="text"
                          value={project.location}
                          onChange={(e) => updateProject(project.id, 'location', e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="form-field">
                        <label>Year</label>
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => updateProject(project.id, 'year', e.target.value)}
                          placeholder="2024"
                        />
                      </div>
                      <div className="form-field">
                        <label>Status</label>
                        <select
                          value={project.status}
                          onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                        >
                          <option value="completed">Completed</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      <div className="form-field full-width" style={{display:'flex', gap:12, alignItems:'center'}}>
                        <button type="button" className="btn btn-secondary" onClick={()=> setEditingProjectIds(prev => ({...prev, [project.id]: !prev[project.id]}))}>
                          {editingProjectIds[project.id] ? 'Hide photos and video' : 'Edit photos and video'}
                        </button>
                        <span style={{color:'#666'}}>Add several photos at once, or upload a video</span>
                      </div>
                      {editingProjectIds[project.id] && (
                        <div className="form-field full-width">
                          <label>Project Images (ordered)</label>
                          <div className="image-upload-section">
                            <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:12}}>
                              <FilePicker
                                label={uploadingKey === `project-${project.id}-images` ? 'Uploading…' : '📁 Select multiple images'}
                                accept="image/*"
                                disabled={Boolean(uploadingKey)}
                                onPick={(files) => handleExistingPicked(project.id, 'images', files)}
                              />
                              <small style={{color:'#666'}}>A 20MB photo is allowed. If it is over 10MB, a high-quality copy is made so the detail stays sharp.</small>
                            </div>
                            {uploadNote?.key === `project-${project.id}-images` && (
                              <p className={uploadNote.isError ? 'upload-error' : 'upload-status'}>{uploadNote.text}</p>
                            )}
                            {(project.images || []).map((img, idx) => (
                              <div
                                key={idx}
                                className="upload-options"
                                style={{alignItems: 'center', gap: 10, marginBottom: 10, border: '1px dashed #e0e0e0', padding: 8, borderRadius: 6}}
                                draggable
                                onDragStart={() => handleImageDragStart(project.id, idx)}
                                onDragOver={handleImageDragOver}
                                onDrop={() => handleImageDrop(project.id, idx)}
                              >
                                <strong style={{ width: 28 }}>{idx + 1}</strong>
                                {(typeof img === 'string' ? img : img.src) ? (
                                  <img src={typeof img === 'string' ? img : img.src} alt="" style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 4 }} />
                                ) : null}
                                <label className="upload-label">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleProjectImageUpload(project.id, idx, e)}
                                    style={{ display: 'none' }}
                                  />
                                  <span className="upload-btn">📁 Upload Image</span>
                                </label>
                                <small style={{color:'#666'}}>JPG, PNG, WEBP. Large photos keep high quality.</small>
                                <input
                                  type="url"
                                  value={typeof img === 'string' ? img : (img.src || '')}
                                  onChange={(e) => updateProjectImage(project.id, idx, 'src', e.target.value)}
                                  placeholder="Paste image URL"
                                  className="url-input"
                                  style={{flex: 1}}
                                />
                                <button type="button" className="btn-delete" onClick={() => moveExistingMedia(project.id, 'images', idx, -1)} disabled={idx===0}>Up</button>
                                <button type="button" className="btn-delete" onClick={() => moveExistingMedia(project.id, 'images', idx, 1)} disabled={idx===(project.images.length-1)}>Down</button>
                                <button type="button" className="btn-delete" onClick={() => removeProjectImage(project.id, idx)}>✕</button>
                              </div>
                            ))}
                            <div style={{marginTop: 8}}>
                              <button type="button" className="btn btn-primary" onClick={() => addProjectImage(project.id)}>+ Add Image</button>
                            </div>
                          </div>
                          <label style={{marginTop: 16, display: 'block'}}>Project Video</label>
                          <div className="image-upload-section">
                            <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:12}}>
                              <FilePicker
                                label={uploadingKey === `project-${project.id}-videos` ? 'Uploading…' : '🎬 Upload video'}
                                accept="video/*"
                                disabled={Boolean(uploadingKey)}
                                onPick={(files) => handleExistingPicked(project.id, 'videos', files)}
                              />
                              <small style={{color:'#666'}}>You can select more than one video. Use Up and Down to set the order. MP4, WEBM, or MOV, up to 100MB each.</small>
                            </div>
                            {uploadNote?.key === `project-${project.id}-videos` && (
                              <p className={uploadNote.isError ? 'upload-error' : 'upload-status'}>{uploadNote.text}</p>
                            )}
                            {(project.videos || []).map((vid, idx) => (
                              <div key={idx} className="upload-options" style={{alignItems:'center', gap:10, marginBottom:10, border:'1px dashed #e0e0e0', padding:8, borderRadius:6}}>
                                <strong style={{ width: 28 }}>{idx + 1}</strong>
                                {vid.src ? <video src={vid.src} controls style={{width:160, height:90, objectFit:'cover', borderRadius:4}} /> : null}
                                <input
                                  type="url"
                                  value={vid.src || ''}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setContent(prev => ({
                                      ...prev,
                                      projects: prev.projects.map(p => {
                                        if (p.id !== project.id) return p;
                                        const videos = [...(p.videos || [])];
                                        videos[idx] = { ...(videos[idx] || {}), src: value, order: videos[idx]?.order ?? idx + 1 };
                                        return { ...p, videos };
                                      })
                                    }));
                                  }}
                                  placeholder="Video URL"
                                  className="url-input"
                                  style={{flex: 1}}
                                />
                                <button type="button" className="btn-delete" onClick={() => moveExistingMedia(project.id, 'videos', idx, -1)} disabled={idx===0}>Up</button>
                                <button type="button" className="btn-delete" onClick={() => moveExistingMedia(project.id, 'videos', idx, 1)} disabled={idx===((project.videos || []).length - 1)}>Down</button>
                                <button type="button" className="btn-delete" onClick={() => removeProjectVideo(project.id, idx)}>✕</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="form-field full-width">
                        <label>Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          rows="3"
                          placeholder="Project description"
                        />
                      </div>
                      <div className="form-field full-width">
                        <label>Design Scope</label>
                        <textarea
                          value={project.designScope || ''}
                          onChange={(e) => updateProject(project.id, 'designScope', e.target.value)}
                          rows="3"
                          placeholder="What this project covers, for example living room, kitchen, and furniture layout"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="btn-delete"
                    >
                      Delete Project
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Save Bar */}
        <div className="admin-save-bar">
          <div className="save-bar-content">
            <button onClick={handleSave} className="btn btn-primary btn-save">
              💾 Save All Changes
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;


