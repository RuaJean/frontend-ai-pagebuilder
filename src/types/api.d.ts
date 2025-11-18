declare namespace Api {
  interface Website {
    id: string;
    name: string;
    slug: string;
    status: "draft" | "published";
  }

  interface MediaItem {
    id: string;
    name: string;
    url: string;
  }
}

export {}; // convierte el archivo en un módulo y evita declaraciones globales duplicadas
