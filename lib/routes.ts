import type { Href } from 'expo-router';

export const routes = {
  home: '/(tabs)' as Href,
  reality: '/reality' as Href,
  student: '/student-priorities' as Href,
  parent: '/parent-priorities' as Href,
  profile: '/profile' as Href,
  pathways: '/pathways' as Href,
  schools: (pathwayId: string) =>
    ({ pathname: '/schools/[pathwayId]', params: { pathwayId } }) as Href,
  school: (schoolId: string) => ({ pathname: '/school/[schoolId]', params: { schoolId } }) as Href,
  email: (schoolId: string) => ({ pathname: '/email/[schoolId]', params: { schoolId } }) as Href,
  plan: '/action-plan' as Href,
};
