env.d.ts;
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface SaveSnippetData {
  clerk_user_id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

interface SaveSnippetSuccess {
  success: true;
  data: {
    title: string;
    description: string;
    code: string;
    language: string;
  };
}

interface SaveSnippetError {
  success: false;
  error: string;
  details?: PostgrestError;
}

type SaveSnippetResult = SaveSnippetSuccess | SaveSnippetError;

type SnippetLanguages =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "html"
  | "css";

interface SnippetApiResponse {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
}
