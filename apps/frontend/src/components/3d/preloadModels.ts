// Preload 3D models for better performance
if (typeof window !== 'undefined') {
  import('@react-three/drei').then(({ useGLTF }) => {
    // Preload all car models
    useGLTF.preload('/glb/2019_bmw_x2_xdrive20d_m_sport_x.glb');

  }).catch(() => {
    // Silently fail if drei is not available
  });
}






