// Preload 3D models for better performance
if (typeof window !== 'undefined') {
  import('@react-three/drei').then(({ useGLTF }) => {
    // Preload all car models
    useGLTF.preload('/glb/toyota_corolla_2020.glb');
    useGLTF.preload('/glb/2019_bmw_x2_xdrive20d_m_sport_x.glb');
    useGLTF.preload('/glb/2021_bmw_3_series_325li.glb');
    useGLTF.preload('/glb/kia_sportage.glb');
    useGLTF.preload('/glb/kia_optima_k5.glb');
  }).catch(() => {
    // Silently fail if drei is not available
  });
}


