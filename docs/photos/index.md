---
title: Photos
description: A gallery of photography and visual memories
---

<script setup>
import { ref, computed } from 'vue'

const categories = [
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'urban', name: 'Urban', icon: '🏙️' },
  { id: 'moments', name: 'Moments', icon: '📸' }
]

const activeCategory = ref('all')

// Real photos from Unsplash
const photos = [
  // Travel
  { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Mountain sunrise in the Alps', category: 'travel', credit: 'Samuel Ferrara' },
  { id: 2, src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', alt: 'Traditional temple in Kyoto', category: 'travel', credit: 'Su San Lee' },
  { id: 3, src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', alt: 'Eiffel Tower at sunset', category: 'travel', credit: 'Chris Karidis' },
  // Nature
  { id: 4, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', alt: 'Sunlight through forest', category: 'nature', credit: 'Luca Bravo' },
  { id: 5, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', alt: 'Tropical beach paradise', category: 'nature', credit: 'Sean Oulashin' },
  { id: 6, src: 'https://images.unsplash.com/photo-1518173946687-a4c036bc1d9a?w=800&q=80', alt: 'Cherry blossoms in spring', category: 'nature', credit: 'AJ' },
  // Urban
  { id: 7, src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', alt: 'New York City skyline', category: 'urban', credit: 'Roberto Vivancos' },
  { id: 8, src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', alt: 'London Tower Bridge at night', category: 'urban', credit: 'Charles Postiaux' },
  { id: 9, src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80', alt: 'Tokyo streets at night', category: 'urban', credit: 'Jezael Melgoza' },
  // Moments
  { id: 10, src: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=800&q=80', alt: 'Coffee and notebook morning', category: 'moments', credit: 'Cathryn Lavery' },
  { id: 11, src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', alt: 'Couple watching sunset', category: 'moments', credit: 'Cody Black' },
  { id: 12, src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', alt: 'Friends laughing together', category: 'moments', credit: 'Helena Lopes' }
]

const filteredPhotos = computed(() => {
  if (activeCategory.value === 'all') return photos
  return photos.filter(p => p.category === activeCategory.value)
})

const selectedPhoto = ref(null)

const openLightbox = (photo) => {
  selectedPhoto.value = photo
}

const closeLightbox = () => {
  selectedPhoto.value = null
}
</script>

# Photos

<p class="gallery-intro">
  A collection of moments captured through my lens. Photography is my way of preserving memories and seeing the world from different perspectives.
</p>

<div class="category-filters">
  <button 
    :class="['filter-btn', { active: activeCategory === 'all' }]"
    @click="activeCategory = 'all'"
  >
    🎨 All
  </button>
  <button 
    v-for="cat in categories" 
    :key="cat.id"
    :class="['filter-btn', { active: activeCategory === cat.id }]"
    @click="activeCategory = cat.id"
  >
    {{ cat.icon }} {{ cat.name }}
  </button>
</div>

<div class="photo-grid">
  <div
    v-for="photo in filteredPhotos"
    :key="photo.id"
    class="photo-card"
    @click="openLightbox(photo)"
  >
    <img :src="photo.src" :alt="photo.alt" loading="lazy" />
    <div class="photo-overlay">
      <span class="photo-credit">{{ photo.credit }}</span>
    </div>
  </div>
</div>

<!-- Lightbox -->
<Teleport to="body">
  <div v-if="selectedPhoto" class="lightbox" @click="closeLightbox">
    <div class="lightbox-content" @click.stop>
      <button class="lightbox-close" @click="closeLightbox">×</button>
      <img :src="selectedPhoto.src.replace('w=800', 'w=1600')" :alt="selectedPhoto.alt" class="lightbox-image" />
      <div class="lightbox-info">
        <p class="lightbox-alt">{{ selectedPhoto.alt }}</p>
        <p class="lightbox-credit">Photo by {{ selectedPhoto.credit }} on Unsplash</p>
      </div>
    </div>
  </div>
</Teleport>

<style scoped>
.gallery-intro {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.filter-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.photo-card {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--vp-c-bg-soft);
}

.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-card:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.photo-credit {
  color: white;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.lightbox-close:hover {
  opacity: 1;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-info {
  text-align: center;
  margin-top: 1rem;
  color: white;
}

.lightbox-alt {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.lightbox-credit {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

@media (max-width: 640px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .category-filters {
    gap: 0.5rem;
    padding: 0.75rem;
  }
  
  .filter-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>

---

::: tip Coming Soon
I'm actively adding more photos to this gallery. Check back for updates!
:::

## Camera Gear

- **Primary**: Sony A7 IV
- **Lenses**: 24-70mm f/2.8, 50mm f/1.4
- **Mobile**: iPhone 15 Pro

---

*All photos © Qiankun. Please contact me for usage inquiries.*
