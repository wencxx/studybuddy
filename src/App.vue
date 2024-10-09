<template>
  <div class="bg-white font-inter dark:bg-gray-900 text-black dark:text-gray-300">
      <header class="flex items-center justify-between h-[7dvh] w-full bg-white/0 sticky top-0 backdrop-blur border-b border-gray-100 dark:border-gray-100/10 px-[5dvw] lg:px-[10dvw] xl:px-[15dvw] z-20">
        <!-- logo -->
        <div>
          <router-link :to="{ name: 'newsfeed' }">
            <h1 class="text-xl font-semibold dark:!text-white"><span class="text-blue-500">Study</span>Buddy</h1>
          </router-link>
        </div>
        <!-- nav -->
        <div class="flex lg:hidden items-center">
          <Icon :icon="iconType" class="text-3xl cursor-pointer" :class="{ 'hidden': !authStore.isAuthenticated  }" @click="toggleSidebar" />
          <nav class="h-[93dvh] w-0 overflow-hidden bg-gray-900 absolute border-r border-gray-100/10 left-0 top-[7dvh] flex flex-col gap-y-2 duration-150" :class="{ '!p-4 !w-2/3': showSidebar }">
            <ul class="hidden flex-col gap-y-2" :class="{ '!flex': showSidebar }">
                <li>
                    <router-link :to="{ name: 'newsfeed' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="mingcute:home-3-fill" class="text-3xl" />
                        <span class="text-xl">Home</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'tasks' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="mingcute:task-2-fill" class="text-3xl" />
                        <span class="text-xl">Tasks</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'notes' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="material-symbols:event-note" class="text-3xl" />
                        <span class="text-xl">Notes</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="ion:storefront" class="text-3xl" />
                        <span class="text-xl">Marketplace</span>
                    </router-link>
                </li>
                <button @click="signout" class="bg-blue-500 rounded mt-6 py-1 hover:bg-blue-500/95">Sign out</button>
            </ul>
          </nav>  
          <button class="flex lg:hidden hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group" @click="toggleDarkmode">
            <Icon icon="ic:twotone-dark-mode" class="text-white hidden dark:block text-2xl" />
            <Icon icon="ic:twotone-light-mode" class="text-yellow-500 block dark:hidden text-2xl" />
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border border-gray-100/10 py-1 rounded-md hidden group-hover:block transition duration-500">
              <p class="text-[.6rem]">Switch mode</p>
            </div>
          </button>
        </div>
        <!-- profile -->
        <div class="hidden lg:flex items-center gap-x-2">
          <div  v-if="authStore.isAuthenticated" class="px-2 border dark:border-gray-100/10 rounded overflow-hidden h-8 flex items-center">
            <input type="text" placeholder="Search" class="bg-transparent focus:outline-none dark:text-gray-300 hidden md:block">
            <Icon icon="mynaui:search" class="text-gray-300 dark:text-white text-2xl" />
          </div>
          <button class="flex hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group" @click="toggleDarkmode">
            <Icon icon="ic:twotone-dark-mode" class="text-white hidden dark:block text-2xl" />
            <Icon icon="ic:twotone-light-mode" class="text-yellow-500 block dark:hidden text-2xl" />
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border border-gray-100/10 py-1 rounded-md hidden group-hover:block transition duration-500">
              <p class="text-[.6rem]">Switch mode</p>
            </div>
          </button>
          <div v-if="authStore.isAuthenticated" class="flex hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group">
            <router-link :to="{ name: 'userDetails', params: { id: currentUser.uid } }" class="!bg-transparent" v-if="currentUser && currentUser.photoURL">
              <Img
                  :src="currentUser.photoURL"
                  alt="profile pic"
                  class="rounded-full w-7 aspect-square"
              />
            </router-link>
            <Icon v-else icon="mdi:user" class="text-white text-3xl border rounded-full p-1" />
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border border-gray-100/10 py-1 rounded-md hidden group-hover:block transition duration-500">
              <p class="text-[.6rem] text-center">Profile</p>
            </div>
          </div>
          <button v-if="authStore.isAuthenticated" class="text-sm bg-blue-500 rounded px-2 py-1" @click="signout">Sign Out</button>
        </div>
      </header>
      <div class="h-[93dvh] w-full bg-custom-primary px-[5dvw] lg:px-[10dvw] xl:px-[15dvw] flex gap-x-2">
        <sideBar v-if="$route.path != '/' && $route.path != '/register' && $route.name !== 'userDetails'" class="h-full w-1/4 hidden lg:block" />
        <router-view :userId="currentUser?.uid" class="min-h-[93dvh] w-full lg:w-2/4 overflow-auto -mt-[10dvh] pt-[12dvh]" />
      </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './plugins/firebase'
import { useAuthStore } from './store'
import { useRouter, useRoute } from 'vue-router'
import { db } from './plugins/firebase'
import { addDoc, collection, doc, getDocs, query, where, onSnapshot, limit } from 'firebase/firestore'

// components import
import sideBar from './components/sideBar.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const currentUser = ref(null)

const iconType = ref('eva:menu-fill')
const showSidebar = ref(false)

watch(() => route.path, (newPath) => {
  if(newPath){
    showSidebar.value = false
    iconType.value = 'eva:menu-fill'
  }
})

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value

  if(showSidebar.value){
    iconType.value = 'iconamoon:close-duotone'
    return 
  }

  iconType.value = 'eva:menu-fill'
}

onAuthStateChanged(auth, (user) => {
  if(user){
    currentUser.value = user
    authStore.currentUser = user
    addUser(user.uid, user.displayName, user.email, user.photoURL)
    getUserDetails(user.uid)
  }else{
    console.log('not logged in')
  }
})

const addUser = async (uid, name, email, photoURL) => {
    try {
        const userQuery = query(
            collection(db, 'users'),
            where('userId', '==', uid)
        );

        const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
          return;
      }

      await addDoc(collection(db, 'users'), {
        userId: uid,
        displayName: name,
        email: email,
        photoURL: photoURL,
        collabs: [],
        incomingCollabRequest: [],
        outgoingCollabRequest: []
      });
    } catch (error) {
      console.error('Error adding user: ', error);
    }
}

const getUserDetails = (uid) => {
  const notesQuery = query(
        collection(db, 'users'),
        where('userId', '==', uid),
        limit(1)
    );

    onSnapshot(notesQuery, (snapshot) => {
       authStore.userDetails = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }, (error) => {
        console.error("Error fetching userDetails: ", error); 
    });
}

const signout = async () => {
  try {
      await signOut(auth)

      localStorage.removeItem('auth')
      localStorage.removeItem('token')

      authStore.logout()
      router.push('/')
  } catch (error) {
    console.log(error)
  }
}

const toggleDarkmode = () => {
  document.documentElement.classList.toggle('dark')
}
</script>

<style scoped>
.router-link-active {
    background-color: #2563eb;
    color: white;
}
</style>
