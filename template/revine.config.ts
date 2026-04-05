export default {
  vite: {
    server: {
      open: false,
      port: 3000,
      host: true,
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
  },
};
