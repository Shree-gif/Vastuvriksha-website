import { useState, useEffect, useRef } from 'react';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import './Projects.css';

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
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await initializeContent();
      const stored = Array.isArray(data.projects) ? data.projects : [];
      setProjects(stored);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Public page is read-only; adding projects moved to Admin page
  // Filter out projects with no title (empty placeholders)
  const validProjects = projects.filter(p => p.title && p.title.trim() !== '');
  
  const filteredProjects = filter === 'all' 
    ? validProjects
    : validProjects.filter(p => p.category === filter || p.status === filter);

  const categories = ['all', 'residential', 'commercial', 'completed', 'ongoing'];

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
                  {cat === 'all' ? t('projects.all') : 
                   cat === 'residential' ? t('projects.residential') :
                   cat === 'commercial' ? t('projects.commercial') :
                   cat === 'completed' ? t('projects.completed') :
                   cat === 'ongoing' ? t('projects.ongoing') :
                   cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                      const raw = Array.isArray(project.images) && project.images.length > 0
                        ? project.images
                        : (project.image ? [project.image] : []);
                      const imgs = raw
                        .slice()
                        .sort((a, b) => {
                          const ao = typeof a === 'string' ? 0 : (a.order ?? 0);
                          const bo = typeof b === 'string' ? 0 : (b.order ?? 0);
                          return ao - bo;
                        })
                        .map(x => (typeof x === 'string' ? x : x.src))
                        .filter(Boolean);
                      const idx = cardIndexMap[project.id] || 0;
                      const current = imgs[idx] || imgs[0];
                      const imgKey = `${project.id}-${idx}`;
                      const isVideo = typeof current === 'string' && (current.endsWith('.mp4') || current.includes('/video/upload'));
                      return current ? (
                        isVideo ? (
                          <video
                            src={current}
                            controls
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

                    {(project.images && project.images.length > 1) && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={(e) => { e.stopPropagation(); prevCardImage(project.id, project.images.length); }}
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
                          onClick={(e) => { e.stopPropagation(); nextCardImage(project.id, project.images.length); }}
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
              <div className="type-card">
                <div className="type-icon">🏠</div>
                <h3>{t('projects.residential')}</h3>
                <p>{t('projects.residentialDesc')}</p>
              </div>
              <div className="type-card">
                <div className="type-icon">🏢</div>
                <h3>{t('projects.commercial')}</h3>
                <p>{t('projects.commercialDesc')}</p>
              </div>
              <div className="type-card">
                <div className="type-icon">🏗️</div>
                <h3>{t('projects.architectural')}</h3>
                <p>{t('projects.architecturalDesc')}</p>
              </div>
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
            {(() => {
              const imgs = (galleryProject.images && galleryProject.images.length > 0)
                ? galleryProject.images
                    .slice()
                    .sort((a,b) => {
                      const ao = typeof a === 'string' ? 0 : (a.order ?? 0);
                      const bo = typeof b === 'string' ? 0 : (b.order ?? 0);
                      return ao - bo;
                    })
                    .map(x => (typeof x === 'string' ? x : x.src))
                    .filter(Boolean)
                : [galleryProject.image].filter(Boolean);
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12
                }}>
                  {imgs.map((src, i) => (
                    <div key={i} className="project-gallery-card">
                      <div className="project-gallery-image" style={{height: 220}}>
                        <img src={src} alt={`${galleryProject.title} ${i+1}`} />
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



