import { useState, useEffect, useRef } from 'react';
// Load projects from Firestore; fallback to local storage on error
import { db } from '../utils/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { PROJECT_CATEGORIES } from '../data/projectCategories';
import './Projects.css';

function mediaUrl(item) {
  return typeof item === 'string' ? item : (item?.src || '');
}

function isVideoUrl(src) {
  if (typeof src !== 'string') return false;
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src) || src.includes('/video/upload');
}

function orderedMedia(list) {
  return (Array.isArray(list) ? list : [])
    .slice()
    .sort((a, b) => {
      const ao = typeof a === 'string' ? 0 : (a.order ?? 0);
      const bo = typeof b === 'string' ? 0 : (b.order ?? 0);
      return ao - bo;
    })
    .map(mediaUrl)
    .filter(Boolean);
}

function projectMedia(project) {
  const images = orderedMedia(
    Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : (project.image ? [project.image] : [])
  );
  return [...images, ...orderedMedia(project.videos)];
}

function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showGallery, setShowGallery] = useState(false);
  const [galleryProject, setGalleryProject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const hoverTimerRef = useRef(null);
  const [cardIndexMap, setCardIndexMap] = useState({});
  const [imageLoadedMap, setImageLoadedMap] = useState({});
  

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'projects'), orderBy('id', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.data()?.id ?? doc.id, ...doc.data() }));
      setProjects(Array.isArray(list) ? list : []);
      setLoading(false);
    }, (err) => {
      console.error('Error loading projects:', err);
      // Fallback to local storage so page isn't empty
      initializeContent()
        .then(data => {
          const stored = Array.isArray(data.projects) ? data.projects : [];
          setProjects(stored);
        })
        .catch(() => setProjects([]))
        .finally(() => setLoading(false));
    });
    return () => unsubscribe();
  }, []);

  // Public page is read-only; adding projects moved to Admin page
  // Filter out projects with no title (empty placeholders)
  const validProjects = projects.filter(p => p.title && p.title.trim() !== '');
  
  const filteredProjects = filter === 'all' 
    ? validProjects
    : validProjects.filter(p => p.category === filter || p.status === filter);

  const categories = ['all', ...PROJECT_CATEGORIES.map(cat => cat.value), 'completed', 'ongoing'];

  const nextImage = (len) => {
    const total = typeof len === 'number' ? len : (galleryProject?.images?.length || 0);
    if (total <= 0) return;
    setCurrentIndex((idx) => (idx + 1) % total);
  };

  const nextCardImage = (projectId, len) => {
    if (!len || len <= 0) return;
    setCardIndexMap(prev => {
      const current = prev[projectId] || 0;
      const next = (current + 1) % len;
      setImageLoadedMap(m => ({ ...m, [`${projectId}-${next}`]: false }));
      return { ...prev, [projectId]: next };
    });
  };

  const prevCardImage = (projectId, len) => {
    if (!len || len <= 0) return;
    setCardIndexMap(prev => {
      const current = prev[projectId] || 0;
      const next = (current - 1 + len) % len;
      setImageLoadedMap(m => ({ ...m, [`${projectId}-${next}`]: false }));
      return { ...prev, [projectId]: next };
    });
  };

  const prevImage = (len) => {
    const total = typeof len === 'number' ? len : (galleryProject?.images?.length || 0);
    if (total <= 0) return;
    setCurrentIndex((idx) => (idx - 1 + total) % total);
  };

  return (
    <div className="projects-page">
      {/* Projects Hero */}
      <section className="projects-hero">
        <div className="container">
          <h1 className="page-title">{t('projects.title')}</h1>
          <p className="page-subtitle">
            {t('projects.subtitle')}
          </p>
        </div>
      </section>

      {/* Projects Content */}
      <section className="section projects-content">
        <div className="container">
          {/* Filter Buttons */}
          <div className="projects-controls">
            <div className="filter-buttons">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {t(`projects.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="projects-gallery">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="project-gallery-card"
                  onClick={() => {
                    setGalleryProject(project);
                    setShowGallery(true);
                  }}
                >
                  <div
                    className="project-gallery-image"
                    style={{ position: 'relative' }}
                  >
                    {(() => {
                      const imgs = projectMedia(project);
                      const idx = cardIndexMap[project.id] || 0;
                      const current = imgs[idx] || imgs[0];
                      const imgKey = `${project.id}-${idx}`;
                      const isVideo = isVideoUrl(current);
                      return current ? (
                        isVideo ? (
                          <video
                            src={current}
                            controls
                            onClick={(e) => e.stopPropagation()}
                            style={{ opacity: imageLoadedMap[imgKey] ? 1 : 0, transition: 'opacity 300ms ease', width: '100%', height: '100%', objectFit: 'contain' }}
                            onLoadedData={() => setImageLoadedMap(prev => ({ ...prev, [imgKey]: true }))}
                          />
                        ) : (
                          <img
                            src={current}
                            alt={project.title}
                            style={{ opacity: imageLoadedMap[imgKey] ? 1 : 0, transition: 'opacity 300ms ease' }}
                            onLoad={() => setImageLoadedMap(prev => ({ ...prev, [imgKey]: true }))}
                          />
                        )
                      ) : (
                        <div className="project-placeholder">
                          <span className="placeholder-icon">🏗️</span>
                          <span className="placeholder-text">No Image</span>
                        </div>
                      );
                    })()}
                    <div className="project-gallery-overlay">
                      <div className="project-badges">
                        {project.category && (
                          <span className="project-badge category-badge">
                            {project.category}
                          </span>
                        )}
                        {project.status && (
                          <span className={`project-badge status-badge status-${project.status}`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {(projectMedia(project).length > 1) && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={(e) => { e.stopPropagation(); prevCardImage(project.id, projectMedia(project).length); }}
                          style={{
                            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                            background: 'rgba(255,255,255,0.5)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '50%',
                            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {'<'}
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={(e) => { e.stopPropagation(); nextCardImage(project.id, projectMedia(project).length); }}
                          style={{
                            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                            background: 'rgba(255,255,255,0.5)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '50%',
                            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {'>'}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="project-gallery-info">
                    <h3 className="project-gallery-title">{project.title}</h3>
                    
                    <div className="project-meta">
                      {project.location && (
                        <span className="project-meta-item">
                          <span className="meta-icon">📍</span>
                          {project.location}
                        </span>
                      )}
                      {project.year && (
                        <span className="project-meta-item">
                          <span className="meta-icon">📅</span>
                          {project.year}
                        </span>
                      )}
                    </div>
                    
                    {project.description && (
                      <p className="project-gallery-description">{project.description}</p>
                    )}

                    {project.designScope && (
                      <p className="project-design-scope">
                        <strong>{t('projects.designScope')}: </strong>
                        {project.designScope}
                      </p>
                    )}

                    {/* Removed "View More" button as per requirement */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>{t('projects.emptyState')}</h3>
              <p>
                {t('projects.emptyMessage')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Project Types Info */}
      {validProjects.length > 0 && (
        <section className="section project-types">
          <div className="container">
            <h2 className="section-title">{t('projects.projectTypes')}</h2>
            
            <div className="types-grid">
              {PROJECT_CATEGORIES.map(cat => (
                <div className="type-card" key={cat.value}>
                  <div className="type-icon">{cat.icon}</div>
                  <h3>{t(`projects.${cat.value}`)}</h3>
                  <p>{t(`projects.${cat.value}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Gallery Modal - Grid view */}
      {showGallery && galleryProject && (
        <div
          className="upload-modal-overlay"
          onClick={() => { setShowGallery(false); setGalleryProject(null); }}
          tabIndex={-1}
        >
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => { setShowGallery(false); setGalleryProject(null); }}>×</button>
            <h2>{galleryProject.title}</h2>
            {galleryProject.designScope && (
              <p className="project-design-scope">
                <strong>{t('projects.designScope')}: </strong>
                {galleryProject.designScope}
              </p>
            )}
            {(() => {
              const imgs = projectMedia(galleryProject);
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12
                }}>
                  {imgs.map((src, i) => (
                    <div key={i} className="project-gallery-card">
                      <div className="project-gallery-image" style={{height: 220}}>
                        {isVideoUrl(src) ? (
                          <video src={src} controls />
                        ) : (
                          <img src={src} alt={`${galleryProject.title} ${i+1}`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Upload moved to Admin panel */}
    </div>
  );
}

export default Projects;



