import { defineStore } from 'pinia';
import { type Project, type CreateProjectDto, PROJECT_LIMITS } from '~/types/project';
import { useAuthStore } from './auth';

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  const activeProjectsCount = computed(() => 
    projects.value.filter(p => !p.deletedAt && p.status === 'ACTIVE').length
  );

  const canCreateProject = computed(() => {
    if (!authStore.user) return false;
    
    // Check if subscription exists and what logic applies. 
    // Assuming 'subscription' field holds plan name or similar. 
    // If null/undefined, we treat as FREE.
    const plan = authStore.user.subscription || 'FREE';
    
    // If strict match 'FREE', check limit.
    if (plan === 'FREE') {
      return activeProjectsCount.value < PROJECT_LIMITS.FREE;
    }
    
    // Other plans assumed unlimited or managed elsewhere for now
    return true;
  });

  async function fetchProjects() {
    loading.value = true;
    error.value = null;
    const { data, error: apiError } = await useApi<Project[]>('/api/projects');
    
    if (apiError.value) {
      error.value = apiError.value.message || 'Failed to fetch projects';
    } else if (data.value) {
      projects.value = data.value;
    }
    loading.value = false;
  }

  async function createProject(projectData: CreateProjectDto) {
    loading.value = true;
    error.value = null;
    
    const { data, error: apiError } = await useApi<Project>('/api/projects', {
      method: 'POST',
      body: projectData,
    });

    if (apiError.value) {
      error.value = apiError.value.message || 'Failed to create project';
      loading.value = false;
      throw new Error(error.value);
    } else if (data.value) {
      // Optimistic update or just push result
      projects.value.push(data.value);
    }
    
    loading.value = false;
    return data.value;
  }

  return {
    projects,
    loading,
    error,
    activeProjectsCount,
    canCreateProject,
    fetchProjects,
    createProject
  };
});
