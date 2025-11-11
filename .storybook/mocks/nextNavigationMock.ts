export const useRouter = () => ({
  push: (url: string) => console.log(`Mock router.push(${url})`),
  replace: (url: string) => console.log(`Mock router.replace(${url})`),
  prefetch: async () => {},
  back: () => console.log('Mock router.back()'),
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
