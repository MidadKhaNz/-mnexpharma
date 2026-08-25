<template>
  <main class="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
    <section class="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-950/30 border border-white/10 overflow-hidden">
      <div class="px-7 pt-7 pb-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-lg">MX</div>
          <div>
            <h1 class="text-xl font-extrabold text-slate-900">MNEX Pharma</h1>
            <p class="text-sm text-gray-500">Secure pharmacy management login</p>
          </div>
        </div>
      </div>

      <form class="px-7 py-6 space-y-4" @submit.prevent="submit">
        <div v-if="authStore.error" class="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {{ authStore.error }}
        </div>

        <div>
          <label class="text-xs font-semibold text-gray-600">Email</label>
          <input v-model.trim="form.email" type="email" autocomplete="email" required class="input" placeholder="admin@mnexpharma.com" />
        </div>

        <div>
          <label class="text-xs font-semibold text-gray-600">Password</label>
          <input v-model="form.password" type="password" autocomplete="current-password" required class="input" placeholder="admin123" />
        </div>

        <button :disabled="authStore.isLoading" class="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold transition-colors">
          {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="text-xs text-gray-400 text-center">
          Demo login: admin@mnexpharma.com / admin123
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'

const router = useRouter()
const authStore = useAuthStore()
const pharmacyStore = usePharmacyStore()
const form = reactive({ email: 'admin@mnexpharma.com', password: 'admin123' })

async function submit() {
  await authStore.login(form)
  await pharmacyStore.fetchInitialData()
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.input { @apply mt-1 w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all; }
</style>
