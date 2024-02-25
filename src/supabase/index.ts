import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = "https://ancwdenvtvtzxwbtxnsc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuY3dkZW52dHZ0enh3YnR4bnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2MzIwMzIsImV4cCI6MjAyNDIwODAzMn0.rbPa4ec6LpHBoVgpyPEEh3X5o3NYipgrXiNygoGAK30";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
