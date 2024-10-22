<template>
    <div class="mx-auto flex items-center justify-center gap-y-10">
        <form @submit.prevent="signup" class="w-full md:w-4/5 xl:w-2/3 border border-gray-300 dark:border-gray-100/10 p-5 rounded-md flex flex-col gap-y-4 items-center">
            <h1 class="text-2xl font-semibold dark:!text-white"><span class="text-blue-500">Study</span>Buddy</h1>
            <div class="flex flex-col gap-y-1 w-full">
                <label>Fullname</label>
                <input type="text" placeholder="Full name" v-model="displayName" class="rounded pl-2 h-10 bg-transparent border border-gray-300 dark:border-gray-100/10" required>
            </div>
            <div class="flex flex-col gap-y-1 w-full">
                <label>Email</label>
                <input type="email" placeholder="Email" v-model="email" class="rounded pl-2 h-10 bg-transparent border border-gray-300 dark:border-gray-100/10" required>
            </div>
            <div class="flex flex-col gap-y-1 w-full">
                <label>Profile picture</label>
                <div class="rounded pl-2 h-10 bg-transparent border border-gray-300 dark:border-gray-100/10 flex items-center justify-center gap-x-2" @click="toggleFileInput">
                    <Icon icon="mage:image-upload" class="text-2xl" />
                    <p>{{ imageName }}</p>
                </div>
                <input type="file" accept=".jpg, .jpeg, .png" class="hidden" id="fileInput" @change="handleFileChange" required>
            </div>
            <div class="flex flex-col gap-y-1 w-full">
                <label>Password</label>
                <input type="password" placeholder="Password" v-model="password" class="rounded pl-2 h-10  bg-transparent border border-gray-300 dark:border-gray-100/10" required>
            </div>
            <!-- <div class="w-full flex justify-between">
                <p class="text-sm cursor-pointer hover:text-blue-500 hover:underline">Forgot password</p>
                <router-link :to="{ name: 'login' }" class="text-sm cursor-pointer hover:text-blue-500 hover:underline">Sign in</router-link>
            </div> -->
            <button v-if="!registering" class="bg-gray-100 mt-1 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 w-full h-10 rounded text-sm">Sign up</button>
            <button v-else class="bg-gray-100 mt-1 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 w-full h-10 rounded px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out focus:outline-none focus:ring-0"
            type="button" disabled
            >
                <div
                    role="status"
                    class="inline-block h-3 w-3 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                >
                    <span
                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >
                    Registering...
                    </span>
                </div>
                Registering
            </button>
            <!-- <p class="text-sm capitalize">or sign in using</p>
            <button @click="signinWithGoogle" type="button" class="border dark:border-gray-100/10 hover:bg-gray-200 hover:dark:bg-gray-800/10 w-full h-10 rounded flex items-center justify-center">
                <Icon icon="flat-color-icons:google" />
                <span>oogle</span>
            </button> -->
        </form>
    </div>
</template>

<script setup>
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, provider, storage } from '../plugins/firebase'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'

const authStore = useAuthStore()
const router = useRouter()

const toggleFileInput = () => {
    const fileInput = document.getElementById('fileInput')

    fileInput.click()
}

const imageName = ref('Choose file')
const image = ref(null)

const handleFileChange = (e) => {
    const imageinput = e.target.files[0] 
    image.value = imageinput

    imageName.value = imageinput.name
}

const displayName = ref('')
const email = ref('')
const password = ref('')

const registering = ref(false)

//sign up using email and password
const signup = async () => {
    const imageRef = storageRef(storage, `images/${image.value.name}`)

    try {
        registering.value = true
        const newUser = await createUserWithEmailAndPassword(auth, email.value, password.value)
        const user = newUser.user

        const snapshot = await uploadBytes(imageRef, image.value)

        const downloadURL = await getDownloadURL(imageRef);

         await updateProfile(user, {
            displayName: displayName.value,
            photoURL: downloadURL
        })

    } catch (error) {
        console.error("Error signing up:", error.message);
    }finally{
        registering.value = false
    }
}

// sign in using gmail
// const signinWithGoogle = async () => {
//     try {
//         const result = await signInWithPopup(auth, provider)

//         const user = result.user
//         const token = user.accessToken

//         localStorage.setItem('auth', true)
//         localStorage.setItem('token', token)
        
//         authStore.login(token)
//         router.push('/home')
//     } catch (error) {
//         console.error(error.message)
//     }
// }
</script>

<style scoped>

</style>