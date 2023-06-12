import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const projectUrl = process.env.SUPABASE_PROJECT_URL
const projectKey = process.env.SUPABASE_PROJECT_KEY

// Stay logged in even after restarting the app
export const supabase = createClient(projectUrl, projectKey, {
    auth: {
        storage: AsyncStorage
    }
});