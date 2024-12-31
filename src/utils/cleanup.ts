// Utility function to clean up object URLs
export const cleanupObjectURL = (url?: string) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};