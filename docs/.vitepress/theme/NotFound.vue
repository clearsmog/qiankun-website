<script setup>
import { useRouter } from 'vitepress'

const { go } = useRouter()
</script>

<template>
  <div class="not-found-page">
    <div class="cosmic-container">
      <div class="stars"></div>
      <div class="astronaut">
        <span class="helmet">👨‍🚀</span>
      </div>
      <h1 class="error-code">404</h1>
      <p class="error-message">Lost in space...</p>
    </div>
    
    <div class="content">
      <h2>Page Not Found</h2>
      <p>The page you're looking for seems to have drifted into another dimension.</p>
      
      <div class="actions">
        <a class="link-btn primary" href="/" @click.prevent="go('/')">
          🏠 Take Me Home
        </a>
        <a class="link-btn" href="/blog/" @click.prevent="go('/blog/')">
          📝 Browse Blog
        </a>
        <a class="link-btn" href="/about" @click.prevent="go('/about')">
          👤 About Me
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.cosmic-container {
  position: relative;
  padding: 3rem 4rem;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.7), transparent),
    radial-gradient(2px 2px at 180px 40px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 220px 90px, rgba(255,255,255,0.5), transparent);
  background-size: 250px 150px;
  animation: twinkle 4s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

.astronaut {
  position: relative;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

.helmet {
  font-size: 4rem;
  display: inline-block;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.error-code {
  position: relative;
  z-index: 1;
  font-size: 6rem;
  font-weight: 800;
  margin: 1rem 0 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 40%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.error-message {
  position: relative;
  z-index: 1;
  color: #a0aec0;
  font-size: 1.25rem;
  margin: 0;
}

.content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.content p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.link-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.link-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.link-btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.link-btn.primary:hover {
  background: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
  color: white;
}

@media (max-width: 640px) {
  .cosmic-container {
    padding: 2rem;
  }
  
  .error-code {
    font-size: 4rem;
  }
  
  .helmet {
    font-size: 3rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
