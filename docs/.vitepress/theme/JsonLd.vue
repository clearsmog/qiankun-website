<script setup>
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, onUnmounted, watch } from 'vue'

const { frontmatter, page } = useData()
const route = useRoute()

// Generate JSON-LD structured data for blog posts
const jsonLd = computed(() => {
  if (!frontmatter.value.date) return null
  
  const baseUrl = 'https://qiankun.co.uk'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': frontmatter.value.title || page.value.title,
    'description': frontmatter.value.description || '',
    'image': frontmatter.value.image || `${baseUrl}/og-image.svg`,
    'datePublished': frontmatter.value.date,
    'dateModified': frontmatter.value.lastUpdated || frontmatter.value.date,
    'author': {
      '@type': 'Person',
      'name': frontmatter.value.author || 'Qiankun',
      'url': baseUrl
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Qiankun',
      'url': baseUrl
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}${route.path}`
    }
  }
})

let scriptElement = null

function updateJsonLd() {
  // Remove existing
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
    scriptElement = null
  }
  
  // Add new if we have data
  if (jsonLd.value && typeof document !== 'undefined') {
    scriptElement = document.createElement('script')
    scriptElement.type = 'application/ld+json'
    scriptElement.id = 'blog-jsonld'
    scriptElement.textContent = JSON.stringify(jsonLd.value)
    document.head.appendChild(scriptElement)
  }
}

onMounted(() => {
  updateJsonLd()
})

watch(() => route.path, () => {
  updateJsonLd()
})

onUnmounted(() => {
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
  }
})
</script>

<template>
  <!-- This component injects JSON-LD but renders nothing visible -->
</template>
