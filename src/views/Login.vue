<template>
    <div class="mx-auto flex items-center justify-center gap-y-10">
        <form @submit.prevent="login" class="w-full md:w-4/5 xl:w-2/4 border border-gray-300 dark:border-gray-100/10 p-5 rounded-md flex flex-col gap-y-4 items-center">
            <h1 class="text-2xl font-semibold dark:!text-white"><span class="text-blue-500">Study</span>Buddy</h1>
            <p v-if="invalidCredentials" class="text-sm bg-red-500 w-full pl-2 rounded py-1">Invalid Credentials</p>
            <div class="flex flex-col gap-y-1 w-full">
                <label>Student Number</label>
                <input type="text" v-model="email" placeholder="Student Number" class="rounded pl-2 h-10 bg-transparent border border-gray-300 dark:border-gray-100/10" required>
            </div>
            <div class="flex flex-col gap-y-1 w-full">
                <label>Password</label>
                <input type="password" placeholder="Password" v-model="password" class="rounded pl-2 h-10  bg-transparent border border-gray-300 dark:border-gray-100/10" required>
            </div>
            <div class="w-full flex justify-between">
                <p class="text-sm cursor-pointer hover:text-blue-500 hover:underline">Forgot password</p>
                <!-- <router-link :to="{ name: 'register' }" class="text-sm cursor-pointer hover:text-blue-500 hover:underline">Sign up</router-link> -->
            </div>
            <button v-if="!loggingIn" class="bg-gray-100 mt-1 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 w-full h-10 rounded uppercase text-sm">Sign in</button>
            <button v-else  class="bg-gray-100 mt-1 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 w-full h-10 rounded px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out focus:outline-none focus:ring-0"
            type="button" disabled
            >
                <div
                    role="status"
                    class="inline-block h-3 w-3 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                >
                    <span
                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >
                    Signing in...
                    </span>
                </div>
                Signing in
            </button>
            <!-- <p class="text-sm capitalize">or sign in using</p>
            <button @click="signinWithGoogle" type="button" class="border dark:border-gray-100/10 hover:bg-gray-200 hover:dark:bg-gray-800/10 w-full h-10 rounded flex items-center justify-center">
                <Icon icon="flat-color-icons:google" />
                <span>oogle</span>
            </button> -->
        </form>
        <div class="absolute bottom-5 flex justify-center w-full">
            <p class="text-center w-2/3 text-sm">Please send an email to <a href="mailto:studybuddynotetaking@gmail.com" class="text-blue-500">studybuddynotetaking@gmail.com</a> for your StudyBuddy account.</p>
        </div>
    </div>
</template>

<script setup>
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, provider } from '../plugins/firebase'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const loggingIn = ref(false)

const invalidCredentials = ref(false)

const login = async () => {
    try {
        loggingIn.value = true
        const userCredentials = await signInWithEmailAndPassword(auth, `${email.value}@gmail.com`, password.value)
        const user = userCredentials.user

        const token = user.accessToken

        localStorage.setItem('auth', true)
        localStorage.setItem('token', token)
        
        authStore.login(token)
        const redirect = router.currentRoute.value.query.redirect || '/home';
        // router.push('/home')
        router.push(redirect);
    } catch (error) {
        if(error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email'){
            invalidCredentials.value = true
        }
        console.log(error)
    }finally{
        loggingIn.value = false
    }
}
</script>

<style scoped>

</style>