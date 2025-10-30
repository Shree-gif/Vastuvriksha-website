import { useState, useEffect } from 'react';
import { initializeContent, saveContent, resetContent } from '../utils/storage';
import './Admin.css';

function Admin() {
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState('siteInfo');
  const [saveStatus, setSaveStatus] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password protection (in production, use proper authentication)
  const ADMIN_PASSWORD = 'Vastuvriksha@2025';

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      initializeContent().then(data => setContent(data));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      initializeContent().then(data => setContent(data));
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
    const newProject = {
      id: Date.now(),
      title: '',
      category: 'residential',
      description: '',
      image: '',
      location: '',
      year: new Date().getFullYear().toString(),
      status: 'completed'
    };
    setContent({
      ...content,
      projects: [...content.projects, newProject]
    });
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
    }
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
              <div className="section-header">
                <h2>Projects</h2>
                <button onClick={addProject} className="btn btn-primary">
                  + Add Project
                </button>
              </div>

              <div className="items-list">
                {content.projects.map(project => (
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
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="architectural">Architectural</option>
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
                      <div className="form-field full-width">
                        <label>Project Image</label>
                        <div className="image-upload-section">
                          <div className="upload-options">
                            <div className="upload-option">
                              <label className="upload-label">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(project.id, e)}
                                  style={{ display: 'none' }}
                                />
                                <span className="upload-btn">📁 Upload Image</span>
                              </label>
                              <span className="upload-hint">Max 2MB (JPG, PNG, GIF)</span>
                            </div>
                            <div className="upload-divider">OR</div>
                            <div className="upload-option">
                              <input
                                type="url"
                                value={project.image && !project.image.startsWith('data:') ? project.image : ''}
                                onChange={(e) => updateProject(project.id, 'image', e.target.value)}
                                placeholder="Paste image URL here"
                                className="url-input"
                              />
                              <span className="upload-hint">Use external image URL</span>
                            </div>
                          </div>
                          {project.image && (
                            <div className="image-preview">
                              <img src={project.image} alt="Preview" />
                              <button
                                type="button"
                                onClick={() => updateProject(project.id, 'image', '')}
                                className="remove-image-btn"
                              >
                                ✕ Remove Image
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-field full-width">
                        <label>Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          rows="3"
                          placeholder="Project description"
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


