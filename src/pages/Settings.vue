<template>
  <div class="space-y-6">
    <div>
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure pharmacy information, preferences and system settings.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings menu -->
      <div class="lg:col-span-1">
        <BaseCard :padding="false">
          <nav class="py-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="['w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors', activeTab === tab.key ? 'bg-brand-50 text-brand-700 border-r-2 border-brand-600' : 'text-gray-600 hover:bg-gray-50']"
              @click="activeTab = tab.key"
            >
              <component :is="tab.icon" class="w-4 h-4 shrink-0" />
              {{ tab.label }}
            </button>
          </nav>
        </BaseCard>
      </div>

      <!-- Settings content -->
      <div class="lg:col-span-3">
        <!-- Pharmacy Info -->
        <BaseCard v-if="activeTab === 'pharmacy'" title="Pharmacy Information" subtitle="Update your pharmacy's public details.">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInput v-model="form.pharmacy_name" label="Pharmacy Name" placeholder="MNEXPharma" />
            <BaseInput v-model="form.license_number" label="License Number" placeholder="DGDA-2024-00000" />
            <BaseInput v-model="form.phone" label="Phone" placeholder="+880-2-0000000" />
            <BaseInput v-model="form.email" label="Email" placeholder="info@mnexpharma.com" type="email" />
            <BaseInput v-model="form.address" label="Address" placeholder="Street, City" class="sm:col-span-2" type="textarea" :rows="2" />
          </div>
          <div class="mt-5 flex justify-end">
            <BaseButton @click="save">Save Changes</BaseButton>
          </div>
        </BaseCard>

        <!-- Invoice Settings -->
        <BaseCard v-if="activeTab === 'invoice'" title="Invoice Settings" subtitle="Customise invoice header and footer.">
          <div class="space-y-4">
            <BaseInput v-model="form.invoice_prefix" label="Invoice Prefix" placeholder="INV-2026-" />
            <BaseInput v-model="form.invoice_footer" label="Footer Note" placeholder="Thank you for your purchase." type="textarea" :rows="3" />
          </div>
          <div class="mt-5 flex justify-end">
            <BaseButton @click="save">Save Changes</BaseButton>
          </div>
        </BaseCard>

        <!-- Preferences -->
        <BaseCard v-if="activeTab === 'preferences'" title="System Preferences">
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-800">Low Stock Alert Threshold</p>
                <p class="text-xs text-gray-500">Alert when stock falls below this number</p>
              </div>
              <input v-model.number="form.reorder_threshold" type="number" class="w-20 h-9 rounded-lg border border-gray-300 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p class="text-sm font-medium text-gray-800">Expiry Warning Days</p>
                <p class="text-xs text-gray-500">Warn about medicines expiring within N days</p>
              </div>
              <input v-model.number="form.expiry_alert_days" type="number" class="w-20 h-9 rounded-lg border border-gray-300 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <BaseButton @click="save">Save Preferences</BaseButton>
          </div>
        </BaseCard>

        <!-- Security -->
        <BaseCard v-if="activeTab === 'security'" title="Change Password">
          <div class="space-y-4 max-w-sm">
            <BaseInput label="Current Password" type="password" />
            <BaseInput label="New Password"     type="password" />
            <BaseInput label="Confirm Password" type="password" />
          </div>
          <div class="mt-5 flex justify-end">
            <BaseButton variant="danger">Update Password</BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import BaseCard   from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import { BuildingStorefrontIcon, DocumentTextIcon, CogIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const activeTab = ref('pharmacy')
const store = usePharmacyStore()
const form = ref({})
const savedMessage = ref('')
const settings = computed(() => store.settings ?? {})

watch(settings, (value) => {
  form.value = {
    pharmacy_name: 'MNEXPharma',
    license_number: '',
    phone: '',
    email: '',
    address: '',
    invoice_prefix: 'INV-2026-',
    invoice_footer: 'Thank you for your purchase.',
    reorder_threshold: 50,
    expiry_alert_days: 30,
    ...value,
  }
}, { immediate: true })

async function save() {
  await store.saveSettings(form.value)
  savedMessage.value = 'Saved'
  setTimeout(() => { savedMessage.value = '' }, 1500)
}

const tabs = [
  { key: 'pharmacy',    label: 'Pharmacy Info',  icon: BuildingStorefrontIcon },
  { key: 'invoice',     label: 'Invoice',        icon: DocumentTextIcon       },
  { key: 'preferences', label: 'Preferences',    icon: CogIcon                },
  { key: 'security',    label: 'Security',       icon: ShieldCheckIcon        }
]
</script>
