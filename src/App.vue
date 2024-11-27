<template>
  <div class="bg-white font-inter dark:bg-gray-900 text-black dark:text-gray-300">
      <header class="flex items-center justify-between h-[7dvh] w-full bg-white/0 sticky top-0 backdrop-blur border-b border-gray-100 dark:border-gray-100/10 px-[5dvw] lg:px-[8dvw] xl:px-[5dvw] z-20">
        <!-- logo -->
        <div>
          <router-link :to="{ name: 'newsfeed' }">
            <h1 class="text-xl font-semibold dark:!text-white"><span class="text-blue-500">Study</span><span class="text-black dark:text-white">Buddy</span></h1>
          </router-link>
        </div>
        <!-- nav -->
        <div class="flex lg:hidden items-center"> 
          <nav class="h-[93dvh] w-0 overflow-hidden bg-gray-900 absolute border-r border-gray-100/10 left-0 top-[7dvh] flex flex-col gap-y-2 duration-150" :class="{ '!p-4 !w-2/3': showSidebar }">
            <ul class="hidden flex-col gap-y-2" :class="{ '!flex': showSidebar }">
                <li>
                    <router-link :to="{ name: 'newsfeed' }" class="text-white flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="mingcute:home-3-fill" class="text-3xl" />
                        <span class="text-xl">Home</span>
                    </router-link>
                </li>
                <li>
                    <div @click="toggleGroups = !toggleGroups" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="fluent-mdl2:publish-course" class="text-2xl" />
                        <span class="text-xl">Courses</span>
                        <Icon icon="weui:arrow-outlined" class="text-2xl ml-auto duration-150" :class="{ 'rotate-90': toggleGroups }" />
                    </div>
                    <div v-if="toggleGroups" class="flex flex-col gap-y-1 pl-10 mt-3">
                        <router-link :to="{ name: 'ITNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Information Technology</span>
                        </router-link>
                        <router-link :to="{ name: 'ISNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Information Systems</span>
                        </router-link>
                        <router-link :to="{ name: 'INDUSNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Industrial Technology</span>
                        </router-link>
                        <router-link :to="{ name: 'EDUCNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Technical Teacher Education</span>
                        </router-link>
                        <router-link :to="{ name: 'CENewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Computer Engineering</span>
                        </router-link>
                    </div>
                </li>
                <li>
                    <router-link :to="{ name: 'requests' }" class="text-white flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="carbon:collaborate" class="text-3xl" />
                        <span class="text-xl">Request</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'quiz' }" class="text-white flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'sharedQuiz' }">
                        <Icon icon="mingcute:task-2-fill" class="text-3xl" />
                        <span class="text-xl">Quiz</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'notes' }" class="text-white flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="material-symbols:event-note" class="text-3xl" />
                        <span class="text-xl">Notes</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'calendar' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'calendar' }">
                        <Icon icon="tabler:calendar" class="text-2xl"/>
                        <span class="text-xl">Calendar</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'rate' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'rate' }">
                        <Icon icon="iconoir:star" class="text-2xl"/>
                        <span class="text-xl">Rate Us</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'feedback' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'feedback' }">
                        <Icon icon="mdi:feedback-outline" class="text-2xl"/>
                        <span class="text-xl">Feedback</span>
                    </router-link>
                </li>
                <li>
                    <div @click="toggledMarketplace = !toggledMarketplace" class="text-white flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="ion:storefront" class="text-3xl" />
                        <span class="text-xl">Marketplace</span>
                        <Icon icon="weui:arrow-outlined" class="text-2xl ml-auto duration-150" :class="{ 'rotate-90': toggledMarketplace }" />
                    </div>
                    <div v-if="toggledMarketplace" class="flex flex-col gap-y-1 pl-10 mt-3">
                        <router-link :to="{ name: 'selling' }" class="text-white flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Sell a product</span>
                        </router-link>
                        <router-link :to="{ name: 'listings' }" class="text-white flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Listings</span>
                        </router-link>
                    </div>
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
          <button v-if="authStore.isAuthenticated" class="hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group">
            <router-link :to="{ name: 'messages' }" class="relative">
              <Icon icon="mage:message-dots-fill" class="text-2xl text-gray-400 dark:text-gray-300" />
              <span v-if="notViewMessages > 0" class="absolute -top-1 -right-1 text-[0.6rem] bg-red-500 py-[0.05rem] px-[0.4rem] rounded-full text-white">{{ notViewMessages }}</span>
            </router-link>
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
              <p class="text-[.6rem]">Messages</p>
            </div>
          </button>
          <button v-if="authStore.isAuthenticated" class="hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group">
            <router-link :to="{ name: 'notifications' }" class="relative">
              <Icon icon="ion:notifications" class="text-2xl text-gray-400 dark:text-gray-300" />
              <span v-if="notViewNotifications > 0" class="absolute -top-1 -right-1 text-[0.6rem] bg-red-500 py-[0.05rem] px-[0.4rem] rounded-full text-white">{{ notViewNotifications }}</span>
            </router-link>
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
              <p class="text-[.6rem]">Notifications</p>
            </div>
          </button>
          <Icon :icon="iconType" class="text-3xl text-gray-900 dark:text-white cursor-pointer" :class="{ 'hidden': !authStore.isAuthenticated  }" @click="toggleSidebar" />
        </div>
        <!-- profile -->
        <div class="hidden lg:flex items-center gap-x-2">
          <div v-if="authStore.isAuthenticated" class="px-2 border dark:border-gray-100/10 rounded overflow-hidden h-8 flex items-center">
            <input v-if="$route.name === 'notes' || $route.name === 'sharedNotes'" type="text" placeholder="Search" class="bg-transparent focus:outline-none dark:text-gray-300 hidden md:block" v-model="searchQuery">
            <input v-else type="text" placeholder="Search" class="bg-transparent focus:outline-none dark:text-gray-300 hidden md:block" @keyup="search" v-model="searchQuery">
            <Icon icon="mynaui:search" class="text-gray-400 dark:text-white text-2xl" @click="searchByClicking" />
          </div>
          <button class="flex hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group" @click="toggleDarkmode">
            <Icon icon="ic:twotone-dark-mode" class="hidden dark:block text-2xl" />
            <Icon icon="ic:twotone-light-mode" class="text-yellow-500 block dark:hidden text-2xl" />
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
              <p class="text-[.6rem]">Switch mode</p>
            </div>
          </button>
          <button v-if="authStore.isAuthenticated" class="hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group">
            <router-link :to="{ name: 'messages' }" class="relative">
              <Icon icon="mage:message-dots-fill" class="text-2xl text-gray-400 dark:text-gray-300" />
              <span v-if="notViewMessages > 0" class="absolute -top-1 -right-1 text-[0.6rem] bg-red-500 py-[0.05rem] px-[0.4rem] rounded-full text-white">{{ notViewMessages }}</span>
            </router-link>
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
              <p class="text-[.6rem]">Messages</p>
            </div>
          </button>
          <button v-if="authStore.isAuthenticated" class="hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group">
            <router-link :to="{ name: 'notifications' }" class="relative">
              <Icon icon="ion:notifications" class="text-2xl text-gray-400 dark:text-gray-300" />
              <span v-if="notViewNotifications > 0" class="absolute -top-1 -right-1 text-[0.6rem] bg-red-500 py-[0.05rem] px-[0.4rem] rounded-full text-white">{{ notViewNotifications }}</span>
            </router-link>
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
              <p class="text-[.6rem]">Notifications</p>
            </div>
          </button>
          <div v-if="authStore.isAuthenticated && currentUser" class="flex hover:bg-gray-100 hover:dark:bg-gray-800/50 p-1 rounded relative group">
            <router-link :to="{ name: 'userDetails', params: { id: currentUser?.uid } }" class="!bg-transparent" v-if="currentUser && currentUser.photoURL">
              <img
                  :src="currentUser.photoURL"
                  alt="profile pic"
                  class="rounded-full w-7 aspect-square"
              />
            </router-link>
            <router-link v-else :to="{ name: 'userDetails', params: { id: currentUser?.uid } }" class="!bg-transparent">
              <Icon icon="mdi:user" class="text-gray-400 dark:text-white text-3xl border rounded-full p-1" />
            </router-link>
            <div class="absolute top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 w-[300%] border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
              <p class="text-[.6rem] text-center">Profile</p>
            </div>
          </div>
          <button v-if="authStore.isAuthenticated" class="text-sm text-white bg-blue-500 rounded px-2 py-1" @click="signout">Sign Out</button>
        </div>
      </header>
      <!-- body -->
      <div class="h-[93dvh] w-full bg-custom-primary px-[5dvw] lg:px-[8dvw] xl:px-[5dvw] flex gap-x-2">
        <sideBar v-if="$route.path != '/' && $route.path != '/register' && $route.name !== 'userDetails'" class="h-full w-1/4 hidden lg:block" />
        <router-view :searchQuery="searchQuery" :collaborated="collaborated" :userId="currentUser?.uid" class="min-h-[93dvh] w-full lg:w-2/4 overflow-auto -mt-[10dvh] pt-[12dvh] pr-5" />
        <rightSideBar @collabs="getCollabs" :userId="currentUser?.uid" v-if="$route.path != '/' && $route.path != '/register' && $route.name !== 'userDetails'" class="h-full w-1/4 hidden lg:block" />
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './plugins/firebase'
import { useAuthStore, useDataStore } from './store'
import { useRouter, useRoute } from 'vue-router'
import { db } from './plugins/firebase'
import { addDoc, collection, doc, getDocs, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore'

// components import
import sideBar from './components/sideBar.vue'
import rightSideBar from './components/collaboratedSideBar.vue'

const searchQuery = ref('')


const toggledMarketplace = ref(false)
const toggleGroups = ref(false)

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const dataStore = useDataStore()

const currentUser = ref(null)

const iconType = ref('eva:menu-fill')
const showSidebar = ref(false)

watch(() => route.path, (newPath) => {
  if(newPath){
    showSidebar.value = false
    iconType.value = 'eva:menu-fill'
    searchQuery.value = ''
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
    getUserDetails(user.uid)
    getNotifications(user.uid)
    getMessages(user.uid)
  }
})

const getUserDetails = (uid) => {
  const notesQuery = query(
        collection(db, 'users'),
        where('userId', '==', uid),
        limit(1)
    );

    onSnapshot(notesQuery, (snapshot) => {
       authStore.userDetails = { id: snapshot.docs[0]?.id, ...snapshot.docs[0]?.data() };
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

// get collabs from sidebar
const collaborated = ref([])

const getCollabs = (data) => {
  collaborated.value = data
}

// get notifications
const notifRef = collection(db, 'notifications')
const notifications = ref([])
const notViewNotifications = ref(0)

const getNotifications = async (uid) => {
  try {
    onSnapshot(
        query(
          notifRef,
          where('to', '==', uid),
          orderBy('notifiedAt', 'desc')
        ),
        (snapshot) => {
          notifications.value = []
          dataStore.notifications = []
          notViewNotifications.value = 0
          snapshot.docs.forEach(doc => {
            dataStore.notifications.push({
              id: doc.id,
              ...doc.data()
            })
            if(!doc.data().isView){
              notViewNotifications.value++
            }
            notifications.value.push({
              id: doc.id,
              ...doc.data()
            })
          })
        }
    )

  } catch (error) {
    
  }
}

// get messages
const messageRef = collection(db, 'messages')
const messages = ref([])
const notViewMessages = ref(0)

const getMessages = async (uid) => {
  try {
    onSnapshot(
      query(
        messageRef,
        where('receiveBy', '==', uid)
      ),
      (snapshot) => {
        messages.value = []
        notViewMessages.value = 0

        const countedSenders = new Set()

        snapshot.docs.forEach(doc => {
          const messageData = { id: doc.id, ...doc.data() }
          messages.value.push(messageData)

          if (!messageData.isView && !countedSenders.has(messageData.sendBy)) {
            notViewMessages.value++
            countedSenders.add(messageData.sendBy)
          }
        })
      }
    )
  } catch (error) {
    console.log(error)
  }
}



const toggleDarkmode = () => {
  document.documentElement.classList.toggle('dark')
}

const search = () => {
  if(!searchQuery.value) return

  if(event.key === 'Enter'){
    router.push({
      name: 'search',
      query: {
        q: searchQuery.value
      }
    })
  }
}

const searchByClicking = () => {
  if(!searchQuery.value) return

   router.push({
      name: 'search',
      query: {
        q: searchQuery.value
      }
  })
}
</script>

<style scoped>
.router-link-active {
    background-color: #2563eb;
    color: white;
}
</style>