import { supabase, supabaseBucket } from "../src/utils/supabase";

async function setupStorage() {
  console.log("Criando bucket:", supabaseBucket);

  // Verificar se o bucket já existe
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Erro ao listar buckets:", listError);
    process.exit(1);
  }

  const bucketExists = buckets?.some((b) => b.name === supabaseBucket);

  if (bucketExists) {
    console.log("Bucket já existe!");
  } else {
    // Criar bucket público
    const { data, error } = await supabase.storage.createBucket(supabaseBucket, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    });

    if (error) {
      console.error("Erro ao criar bucket:", error);
      process.exit(1);
    }

    console.log("Bucket criado com sucesso!");
  }

  process.exit(0);
}

setupStorage();
