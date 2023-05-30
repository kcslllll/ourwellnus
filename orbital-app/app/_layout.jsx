import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";

/** every single page in this "app" folder has this layout
    <Slot /> is replaced by the contents of the corresponding pages
*/

export default function Root() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    )
}