<template>
  <div class="flex flex-col h-full gap-4">

    <!-- ── Daily Summary Bar ─────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="card in analyticsCards"
        :key="card.label"
        :class="['bg-white rounded-2xl border shadow-sm px-4 py-3.5 hover:shadow-md transition-all duration-200', card.border]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{{ card.label }}</p>
            <p class="text-xl font-extrabold text-gray-900 mt-0.5">{{ card.value }}</p>
          </div>
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', card.iconBg]">
            <component :is="card.icon" :class="['w-5 h-5', card.iconColor]" />
          </div>
        </div>
        <p :class="['text-[10px] font-medium mt-1', card.subColor]">{{ card.sub }}</p>
      </div>
    </div>

    <!-- ── POS Layout ──────────────────────────────────────────────────────── -->
    <div class="flex gap-4 min-h-0" style="height: calc(100vh - 260px); min-height: 560px">

      <!-- ══════════════════════════════════════════════════════════════════ -->
      <!-- LEFT PANEL — Medicine Browser                                      -->
      <!-- ══════════════════════════════════════════════════════════════════ -->
      <div class="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden">

        <!-- Search + Category -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 shrink-0">
          <div class="flex gap-2">
            <div class="relative flex-1">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="search"
                type="text"
                placeholder="Search by name, generic or batch…"
                class="w-full pl-9 pr-3 h-10 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
            </div>
            <button v-if="search" @click="search = ''" class="h-10 px-3 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <div class="flex gap-1.5 mt-2.5 flex-wrap">
            <button
              @click="activeCategory = ''"
              :class="['px-3 py-1 rounded-full text-xs font-semibold transition-all border',
                       !activeCategory ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300']"
            >All</button>
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = activeCategory === cat ? '' : cat"
              :class="['px-3 py-1 rounded-full text-xs font-semibold transition-all border',
                       activeCategory === cat ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300']"
            >{{ cat }}</button>
          </div>
        </div>

        <!-- Medicine Cards -->
        <div class="flex-1 overflow-y-auto pr-1 custom-scroll min-h-0">
          <!-- Results row -->
          <div class="flex items-center justify-between mb-2.5 px-0.5">
            <p class="text-xs text-gray-500">
              <span class="font-semibold text-gray-800">{{ filteredMeds.length }}</span> medicines
            </p>
            <div class="flex items-center gap-1.5">
              <button @click="gridView = true"  :class="['p-1 rounded-lg', gridView ? 'bg-brand-50 text-brand-600' : 'text-gray-400 hover:text-gray-600']"><Squares2X2Icon class="w-4 h-4" /></button>
              <button @click="gridView = false" :class="['p-1 rounded-lg', !gridView ? 'bg-brand-50 text-brand-600' : 'text-gray-400 hover:text-gray-600']"><ListBulletIcon class="w-4 h-4" /></button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!filteredMeds.length" class="flex flex-col items-center gap-3 py-16">
            <BeakerIcon class="w-10 h-10 text-gray-200" />
            <p class="text-sm text-gray-400">No medicines match your search.</p>
            <button @click="search = ''; activeCategory = ''" class="text-xs text-brand-600 hover:underline">Clear filters</button>
          </div>

          <!-- Grid view -->
          <div v-else-if="gridView" class="grid grid-cols-2 xl:grid-cols-3 gap-3 pb-2">
            <div
              v-for="med in filteredMeds"
              :key="med.id"
              :class="['bg-white rounded-2xl border shadow-sm p-3.5 flex flex-col gap-2 transition-all duration-150 cursor-pointer select-none',
                       med.stock === 0 || isExpired(med) ? 'opacity-55 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5 hover:border-brand-200',
                       isInCart(med.id) ? 'border-brand-300 bg-brand-50/20 ring-1 ring-brand-200' : 'border-gray-100']"
              @click="addToCart(med)"
            >
              <div class="flex items-start justify-between">
                <span :class="['inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold leading-tight', catBadge(med.category)]">{{ med.category }}</span>
                <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight', stockChip(med)]">{{ med.stock > 0 ? med.stock : 'OUT' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{{ med.name }}</p>
                <p class="text-[11px] text-gray-400 mt-0.5 leading-tight truncate">{{ med.generic }}</p>
                <p class="text-[10px] font-mono text-gray-300 mt-0.5 truncate">{{ med.batch }}</p>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-gray-50">
                <p class="text-sm font-extrabold text-brand-700">৳{{ med.price.toFixed(2) }}</p>
                <span v-if="isExpired(med)" class="text-[10px] font-bold text-red-500">EXPIRED</span>
                <span v-else-if="med.stock === 0" class="text-[10px] font-bold text-gray-400">NO STOCK</span>
                <button
                  v-else
                  :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-sm text-xs',
                           isInCart(med.id) ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600 hover:bg-brand-100']"
                  @click.stop="addToCart(med)"
                >
                  <CheckIcon v-if="isInCart(med.id)" class="w-4 h-4" />
                  <PlusIcon  v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- List view -->
          <div v-else class="flex flex-col gap-2 pb-2">
            <div
              v-for="med in filteredMeds"
              :key="med.id"
              :class="['bg-white rounded-xl border shadow-sm px-4 py-3 flex items-center gap-3 transition-all duration-150 cursor-pointer',
                       med.stock === 0 || isExpired(med) ? 'opacity-55 cursor-not-allowed' : 'hover:shadow-md hover:border-brand-200',
                       isInCart(med.id) ? 'border-brand-300 ring-1 ring-brand-200 bg-brand-50/10' : 'border-gray-100']"
              @click="addToCart(med)"
            >
              <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0', catBgText(med.category).bg, catBgText(med.category).text]">
                {{ med.category.slice(0,2).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-sm font-bold text-gray-900 truncate">{{ med.name }}</p>
                  <span v-if="isExpired(med)" class="text-[10px] font-bold text-red-500">EXPIRED</span>
                  <span v-else-if="med.stock === 0" class="text-[10px] font-bold text-gray-400">OUT</span>
                </div>
                <p class="text-[11px] text-gray-400 truncate">{{ med.generic }} · {{ med.dosage_form }} · <span class="font-mono">{{ med.batch }}</span></p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-extrabold text-brand-700">৳{{ med.price.toFixed(2) }}</p>
                <p :class="['text-[10px] font-semibold', med.stock < med.reorder ? 'text-amber-500' : 'text-gray-400']">{{ med.stock }} left</p>
              </div>
              <button
                v-if="!isExpired(med) && med.stock > 0"
                :class="['w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0',
                         isInCart(med.id) ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white']"
                @click.stop="addToCart(med)"
              >
                <CheckIcon v-if="isInCart(med.id)" class="w-4 h-4" />
                <PlusIcon  v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════ -->
      <!-- RIGHT PANEL — Cart + Billing                                       -->
      <!-- ══════════════════════════════════════════════════════════════════ -->
      <div class="w-[360px] xl:w-[400px] shrink-0 flex flex-col gap-3 overflow-hidden">

        <!-- ── Cart ─────────────────────────────────────────────────────── -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0" style="flex: 1">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-2">
              <ShoppingCartIcon class="w-5 h-5 text-brand-600" />
              <h2 class="text-base font-bold text-gray-900">Cart</h2>
              <span v-if="cart.length" class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold">{{ totalQty }}</span>
            </div>
            <button v-if="cart.length" @click="clearCart" class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
              <TrashIcon class="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          <div class="flex-1 overflow-y-auto custom-scroll min-h-0">
            <div v-if="!cart.length" class="flex flex-col items-center justify-center py-12 gap-3">
              <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                <ShoppingCartIcon class="w-7 h-7 text-gray-200" />
              </div>
              <p class="text-sm font-medium text-gray-400">Cart is empty</p>
              <p class="text-xs text-gray-300">Click a medicine card to add it</p>
            </div>

            <div v-else class="divide-y divide-gray-50">
              <div
                v-for="item in cart"
                :key="item.id"
                class="px-4 py-3 flex gap-3 items-start hover:bg-gray-50/40 transition-colors group"
              >
                <div :class="['w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5', catBgText(item.category).bg, catBgText(item.category).text]">
                  {{ item.category.slice(0,2).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 leading-tight truncate">{{ item.name }}</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">৳{{ item.price.toFixed(2) }} × {{ item.qty }} = <span class="font-semibold text-gray-700">৳{{ (item.price * item.qty).toFixed(2) }}</span></p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <button @click="decreaseQty(item)" class="w-6 h-6 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors">
                      <MinusIcon class="w-3 h-3" />
                    </button>
                    <input
                      :value="item.qty"
                      @change="e => setQty(item, +e.target.value)"
                      type="number" min="1" :max="item.maxStock"
                      class="w-10 h-6 text-center text-xs font-bold rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                    <button
                      @click="increaseQty(item)"
                      :disabled="item.qty >= item.maxStock"
                      class="w-6 h-6 rounded-lg bg-gray-100 hover:bg-brand-50 hover:text-brand-600 text-gray-500 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <PlusIcon class="w-3 h-3" />
                    </button>
                    <span class="text-[10px] text-gray-300 ml-0.5">/ {{ item.maxStock }}</span>
                  </div>
                </div>
                <button @click="removeFromCart(item.id)" class="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all mt-0.5 shrink-0">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Billing Panel ─────────────────────────────────────────────── -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 shrink-0">
          <!-- Customer -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="billing-label">Customer Name</label>
              <div class="relative">
                <UserIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input v-model="billing.customer" type="text" placeholder="Walk-in Patient" class="billing-input pl-8" />
              </div>
            </div>
            <div>
              <label class="billing-label">Phone</label>
              <div class="relative">
                <PhoneIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input v-model="billing.phone" type="tel" placeholder="01700-000000" class="billing-input pl-8" />
              </div>
            </div>
          </div>

          <!-- Discount + VAT -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="billing-label">Discount (%)</label>
              <div class="relative">
                <TagIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input v-model.number="billing.discountPct" type="number" min="0" max="100" step="0.5" placeholder="0" class="billing-input pl-8" />
              </div>
            </div>
            <div>
              <label class="billing-label">VAT (%)</label>
              <div class="relative">
                <ReceiptPercentIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input v-model.number="billing.vatPct" type="number" min="0" max="50" step="0.5" placeholder="0" class="billing-input pl-8" />
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="bg-gray-50 rounded-xl px-3 py-2.5 space-y-1.5">
            <div class="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span class="font-semibold text-gray-800">৳{{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="discountAmt > 0" class="flex justify-between text-xs text-green-600">
              <span>Discount ({{ billing.discountPct }}%)</span>
              <span class="font-semibold">− ৳{{ discountAmt.toFixed(2) }}</span>
            </div>
            <div v-if="vatAmt > 0" class="flex justify-between text-xs text-amber-600">
              <span>VAT ({{ billing.vatPct }}%)</span>
              <span class="font-semibold">+ ৳{{ vatAmt.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-2 flex justify-between items-baseline">
              <span class="text-sm font-bold text-gray-900">Grand Total</span>
              <span class="text-lg font-extrabold text-brand-700">৳{{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment method -->
          <div>
            <p class="billing-label mb-1.5">Payment Method</p>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                v-for="pm in paymentMethods"
                :key="pm.value"
                :class="['flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all',
                         billing.paymentMethod === pm.value
                           ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                           : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50']"
                @click="billing.paymentMethod = pm.value"
              >
                <component :is="pm.icon" class="w-4 h-4 shrink-0" />
                {{ pm.label }}
              </button>
            </div>
          </div>

          <!-- Cash tendered -->
          <div v-if="billing.paymentMethod === 'Cash'" class="grid grid-cols-2 gap-2">
            <div>
              <label class="billing-label">Cash Tendered (৳)</label>
              <input v-model.number="billing.cashTendered" type="number" min="0" step="1" :placeholder="grandTotal.toFixed(0)" class="billing-input" />
            </div>
            <div>
              <label class="billing-label">Change Due</label>
              <div :class="['billing-input flex items-center font-bold', changeDue < 0 ? 'text-red-600' : 'text-green-700']">
                {{ billing.cashTendered ? `৳${changeDue.toFixed(2)}` : '—' }}
              </div>
            </div>
          </div>

          <!-- Complete Sale button -->
          <button
            @click="completeSale"
            :disabled="!cart.length || saleLoading"
            :class="['w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm',
                     cart.length ? 'bg-brand-600 hover:bg-brand-700 text-white active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed']"
          >
            <span v-if="saleLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <template v-else>
              <CheckCircleIcon class="w-5 h-5" />
              Finalise Bill{{ cart.length ? ` · ৳${grandTotal.toFixed(2)}` : '' }}
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Recent Transactions ──────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-gray-900">Recent Bills</h2>
          <p class="text-xs text-gray-400 mt-0.5">{{ store.sales.length }} total · showing latest 15</p>
        </div>
        <select v-model="txFilter" class="h-8 rounded-lg border border-gray-200 text-xs text-gray-600 px-2 bg-gray-50 focus:outline-none">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="th">Invoice ID</th>
              <th class="th">Customer</th>
              <th class="th hidden sm:table-cell">Payment</th>
              <th class="th text-right">Amount</th>
              <th class="th text-center">Status</th>
              <th class="th hidden md:table-cell">Date / Time</th>
              <th class="th text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-if="!recentTx.length">
              <td colspan="7" class="py-10 text-center text-sm text-gray-400">No transactions found.</td>
            </tr>
            <tr
              v-else
              v-for="tx in recentTx"
              :key="tx.id"
              class="hover:bg-gray-50/60 transition-colors group"
            >
              <td class="px-4 py-3">
                <span class="font-mono text-xs font-semibold text-brand-700">{{ tx.id }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0', avatarColor(tx.customer)]">
                    {{ (tx.customer || 'W').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm text-gray-800 truncate max-w-[120px]">{{ tx.customer }}</span>
                </div>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <div class="flex items-center gap-1.5">
                  <component :is="paymentIcon(tx.payment)" class="w-3.5 h-3.5 text-gray-400" />
                  <span class="text-xs text-gray-500">{{ tx.payment }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900">৳{{ tx.total.toFixed(2) }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold', statusBadge(tx.status)]">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(tx.status)" />
                  {{ tx.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">
                {{ tx.date }}{{ tx.time ? ` · ${tx.time}` : '' }}
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click="viewInvoice(tx)"
                  class="opacity-0 group-hover:opacity-100 text-xs text-brand-600 hover:underline transition-opacity inline-flex items-center gap-1 ml-auto"
                >
                  <EyeIcon class="w-3.5 h-3.5" /> View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- INVOICE MODAL                                                       -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showInvoice" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showInvoice = false" />

          <div class="modal-box relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style="max-height: 90vh">

            <!-- Invoice header -->
            <div class="bg-brand-600 px-6 py-5 text-white shrink-0">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <BeakerIcon class="w-5 h-5 text-brand-200" />
                    <span class="font-bold text-brand-100 text-sm tracking-wide">MNEXPHARMA</span>
                  </div>
                  <p class="text-[10px] text-brand-300 mt-0.5">Professional Pharmacy Management System</p>
                </div>
                <button @click="showInvoice = false" class="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              <div class="mt-4 flex items-end justify-between">
                <div>
                  <p class="text-brand-200 text-[11px] uppercase tracking-wider">Invoice</p>
                  <p class="text-xl font-extrabold font-mono">{{ currentInvoice?.id }}</p>
                </div>
                <div class="text-right">
                  <p class="text-brand-200 text-[11px]">Date</p>
                  <p class="text-sm font-semibold">{{ currentInvoice?.date }}</p>
                  <p class="text-[11px] text-brand-300">{{ currentInvoice?.time }}</p>
                </div>
              </div>
            </div>

            <!-- Invoice body -->
            <div class="flex-1 overflow-y-auto custom-scroll">
              <div class="p-6 space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                    <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ currentInvoice?.customer || 'Walk-in Patient' }}</p>
                    <p v-if="currentInvoice?.phone" class="text-xs text-gray-500">{{ currentInvoice.phone }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment</p>
                    <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ currentInvoice?.payment }}</p>
                    <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold mt-1', statusBadge(currentInvoice?.status)]">
                      {{ currentInvoice?.status }}
                    </span>
                  </div>
                </div>

                <!-- Line items -->
                <div>
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-gray-200">
                        <th class="pb-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Medicine</th>
                        <th class="pb-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-12">Qty</th>
                        <th class="pb-2 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider w-20">Unit</th>
                        <th class="pb-2 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider w-20">Total</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="item in (currentInvoice?.items ?? [])" :key="item.medicine_id">
                        <td class="py-2.5 pr-2">
                          <p class="font-semibold text-gray-900 text-sm leading-tight">{{ item.name }}</p>
                          <p class="text-[11px] text-gray-400">{{ item.generic }}</p>
                        </td>
                        <td class="py-2.5 text-center text-gray-700">{{ item.qty }}</td>
                        <td class="py-2.5 text-right text-gray-700">৳{{ item.price.toFixed(2) }}</td>
                        <td class="py-2.5 text-right font-semibold text-gray-900">৳{{ (item.price * item.qty).toFixed(2) }}</td>
                      </tr>
                      <!-- Legacy mock sales (no items array) -->
                      <tr v-if="!(currentInvoice?.items?.length)">
                        <td colspan="4" class="py-3 text-center text-xs text-gray-400">Item details not available for legacy records.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Totals -->
                <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>৳{{ (currentInvoice?.amount ?? currentInvoice?.total ?? 0).toFixed(2) }}</span>
                  </div>
                  <div v-if="(currentInvoice?.discount ?? 0) > 0" class="flex justify-between text-xs text-green-600">
                    <span>Discount</span>
                    <span>− ৳{{ (currentInvoice?.discount ?? 0).toFixed(2) }}</span>
                  </div>
                  <div v-if="(currentInvoice?.vat ?? 0) > 0" class="flex justify-between text-xs text-amber-600">
                    <span>VAT</span>
                    <span>+ ৳{{ (currentInvoice?.vat ?? 0).toFixed(2) }}</span>
                  </div>
                  <div class="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                    <span class="font-bold text-gray-900">Grand Total</span>
                    <span class="text-lg font-extrabold text-brand-700">৳{{ (currentInvoice?.total ?? 0).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="text-center space-y-1 pt-2 border-t border-gray-100">
                  <p class="text-xs font-semibold text-gray-500">Thank you for your purchase!</p>
                  <p class="text-[10px] text-gray-400">Please keep this invoice for your records.</p>
                  <p class="text-[10px] text-gray-400">MNEXPharma · Dhaka, Bangladesh · support@mnexpharma.com</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <button @click="showInvoice = false" class="h-9 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">Close</button>
              <div class="flex items-center gap-2">
                <button @click="newSale" class="h-9 px-4 rounded-lg border border-brand-200 text-brand-600 text-sm hover:bg-brand-50 transition-colors flex items-center gap-1.5">
                  <PlusIcon class="w-4 h-4" /> New Sale
                </button>
                <button @click="printInvoice" class="h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
                  <PrinterIcon class="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { medicineCategories } from '@/data/mockData.js'
import {
  MagnifyingGlassIcon, XMarkIcon, PlusIcon, MinusIcon, TrashIcon, CheckIcon,
  ShoppingCartIcon, CheckCircleIcon, PrinterIcon, BeakerIcon, EyeIcon,
  UserIcon, PhoneIcon, TagIcon, ReceiptPercentIcon,
  BanknotesIcon, CreditCardIcon, DevicePhoneMobileIcon, BuildingLibraryIcon,
  Squares2X2Icon, ListBulletIcon,
  CurrencyDollarIcon, CalculatorIcon, ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'

// ── Store ──────────────────────────────────────────────────────────────────
const store = usePharmacyStore()

// ── Left Panel ─────────────────────────────────────────────────────────────
const search         = ref('')
const activeCategory = ref('')
const gridView       = ref(true)
const categories     = medicineCategories

const filteredMeds = computed(() => {
  const q = search.value.toLowerCase()
  return store.medicines.filter(m => {
    if (activeCategory.value && m.category !== activeCategory.value) return false
    if (!q) return true
    return m.name.toLowerCase().includes(q) ||
           m.generic.toLowerCase().includes(q) ||
           m.batch.toLowerCase().includes(q)
  })
})

function isExpired(med) {
  return med.status === 'expired' || new Date(med.expiry) < new Date()
}

// ── Cart ───────────────────────────────────────────────────────────────────
const cart = ref([])

function isInCart(id) { return cart.value.some(c => c.id === id) }

function addToCart(med) {
  if (med.stock === 0 || isExpired(med)) return
  const existing = cart.value.find(c => c.id === med.id)
  if (existing) {
    if (existing.qty < existing.maxStock) existing.qty++
    return
  }
  cart.value.push({
    id: med.id, medicine_id: med.id,
    name: med.name, generic: med.generic, category: med.category,
    price: med.price, qty: 1, maxStock: med.stock,
  })
}

function removeFromCart(id)  { cart.value = cart.value.filter(c => c.id !== id) }
function clearCart()         { cart.value = [] }
function increaseQty(item)   { if (item.qty < item.maxStock) item.qty++ }
function decreaseQty(item)   { if (item.qty > 1) item.qty--; else removeFromCart(item.id) }
function setQty(item, val)   { item.qty = Math.max(1, Math.min(item.maxStock, val || 1)) }

const totalQty = computed(() => cart.value.reduce((s, c) => s + c.qty, 0))

// ── Billing ────────────────────────────────────────────────────────────────
const billing = ref({ customer: '', phone: '', discountPct: 0, vatPct: 0, paymentMethod: 'Cash', cashTendered: '' })

const paymentMethods = [
  { value: 'Cash',           label: 'Cash',          icon: BanknotesIcon         },
  { value: 'Card',           label: 'Card',          icon: CreditCardIcon        },
  { value: 'Mobile Banking', label: 'Mobile Banking',icon: DevicePhoneMobileIcon },
  { value: 'Bank Transfer',  label: 'Bank Transfer', icon: BuildingLibraryIcon   },
]

const subtotal    = computed(() => cart.value.reduce((s, c) => s + c.price * c.qty, 0))
const discountAmt = computed(() => subtotal.value * (billing.value.discountPct / 100))
const vatAmt      = computed(() => (subtotal.value - discountAmt.value) * (billing.value.vatPct / 100))
const grandTotal  = computed(() => Math.max(0, subtotal.value - discountAmt.value + vatAmt.value))
const changeDue   = computed(() => (billing.value.cashTendered || 0) - grandTotal.value)

// ── Complete Sale ──────────────────────────────────────────────────────────
const saleLoading    = ref(false)
const showInvoice    = ref(false)
const currentInvoice = ref(null)

async function completeSale() {
  if (!cart.value.length) return
  saleLoading.value = true
  await new Promise(r => setTimeout(r, 600))

  const now  = new Date()
  const sale = {
    id:       store.nextInvoiceId(),
    customer: billing.value.customer || 'Walk-in Patient',
    phone:    billing.value.phone,
    items:    cart.value.map(c => ({
      medicine_id: c.medicine_id, name: c.name, generic: c.generic,
      qty: c.qty, price: c.price,
    })),
    amount:   +subtotal.value.toFixed(2),
    discount: +discountAmt.value.toFixed(2),
    vat:      +vatAmt.value.toFixed(2),
    total:    +grandTotal.value.toFixed(2),
    payment:  billing.value.paymentMethod,
    status:   'paid',
    date:     now.toISOString().slice(0, 10),
    time:     now.toTimeString().slice(0, 5),
  }

  store.addSale(sale)
  currentInvoice.value = sale
  saleLoading.value = false
  showInvoice.value = true
}

function newSale() {
  showInvoice.value = false
  clearCart()
  billing.value = { customer: '', phone: '', discountPct: 0, vatPct: 0, paymentMethod: 'Cash', cashTendered: '' }
}

function viewInvoice(tx) { currentInvoice.value = tx; showInvoice.value = true }

function printInvoice() {
  const items = currentInvoice.value?.items ?? []
  const html = `<!DOCTYPE html><html><head>
    <meta charset="utf-8"><title>${currentInvoice.value?.id ?? 'Invoice'}</title>
    <style>
      *{box-sizing:border-box}body{font-family:Arial,sans-serif;padding:24px;color:#111;font-size:13px}
      h1{font-size:18px;color:#0F766E;margin:0}
      table{width:100%;border-collapse:collapse;margin:12px 0}
      th,td{padding:7px 4px;text-align:left;border-bottom:1px solid #eee}
      th{font-size:11px;text-transform:uppercase;color:#666}
      .r{text-align:right}.c{text-align:center}.bold{font-weight:bold;font-size:15px}
      .brand{color:#0F766E}.footer{margin-top:24px;text-align:center;color:#999;font-size:11px}
    </style></head><body>
    <h1>MNEXPHARMA</h1>
    <p style="color:#666;font-size:11px;margin:2px 0">Invoice #${currentInvoice.value?.id}</p>
    <p style="color:#666;font-size:11px">Date: ${currentInvoice.value?.date} ${currentInvoice.value?.time ?? ''}</p>
    <p><b>Customer:</b> ${currentInvoice.value?.customer ?? 'Walk-in Patient'}</p>
    ${currentInvoice.value?.phone ? `<p><b>Phone:</b> ${currentInvoice.value.phone}</p>` : ''}
    <table><thead><tr><th>Medicine</th><th class="c">Qty</th><th class="r">Unit Price</th><th class="r">Total</th></tr></thead>
    <tbody>
      ${items.length ? items.map(i => `
        <tr>
          <td>${i.name}<br><span style="font-size:11px;color:#999">${i.generic}</span></td>
          <td class="c">${i.qty}</td>
          <td class="r">৳${i.price.toFixed(2)}</td>
          <td class="r">৳${(i.price*i.qty).toFixed(2)}</td>
        </tr>`).join('') : '<tr><td colspan="4" style="color:#999;text-align:center">No item details</td></tr>'}
    </tbody></table>
    <div style="text-align:right">
      <p>Subtotal: ৳${(currentInvoice.value?.amount ?? currentInvoice.value?.total ?? 0).toFixed(2)}</p>
      ${(currentInvoice.value?.discount ?? 0)>0 ? `<p style="color:green">Discount: − ৳${currentInvoice.value.discount.toFixed(2)}</p>` : ''}
      ${(currentInvoice.value?.vat ?? 0)>0 ? `<p style="color:#b45309">VAT: + ৳${currentInvoice.value.vat.toFixed(2)}</p>` : ''}
      <p class="bold brand">Grand Total: ৳${(currentInvoice.value?.total ?? 0).toFixed(2)}</p>
    </div>
    <p><b>Payment:</b> ${currentInvoice.value?.payment ?? '—'}</p>
    <div class="footer"><p>Thank you for your purchase!</p><p>MNEXPharma · Dhaka, Bangladesh · support@mnexpharma.com</p></div>
    </body></html>`

  const win = window.open('', '_blank', 'width=600,height=800')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 300)
}

// ── Recent Transactions ────────────────────────────────────────────────────
const txFilter = ref('')
const recentTx = computed(() => {
  let list = store.sales
  if (txFilter.value) list = list.filter(s => s.status === txFilter.value)
  return list.slice(0, 15)
})

// ── Daily Summary Cards ────────────────────────────────────────────────────
const analyticsCards = computed(() => [
  {
    label: "Bills Today", value: store.todaySalesCount,
    sub: 'Dispensing bills issued', icon: ShoppingCartIcon,
    iconBg: 'bg-brand-50', iconColor: 'text-brand-600',
    border: 'border-gray-100', subColor: 'text-brand-600',
  },
  {
    label: "Today's Collection",
    value: `৳${store.todayRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    sub: 'Paid bills only', icon: CurrencyDollarIcon,
    iconBg: 'bg-green-50', iconColor: 'text-green-600',
    border: 'border-green-100', subColor: 'text-green-600',
  },
  {
    label: 'Avg. Bill Value',
    value: `৳${store.todayAvgSale.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    sub: 'Per bill today', icon: CalculatorIcon,
    iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    border: 'border-blue-100', subColor: 'text-blue-600',
  },
  {
    label: 'Total Bills', value: store.totalTransactions,
    sub: 'All dispensing records', icon: ArrowTrendingUpIcon,
    iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
    border: 'border-purple-100', subColor: 'text-purple-600',
  },
])

// ── Styling helpers ────────────────────────────────────────────────────────
const CAT_BADGE = {
  Analgesic:'bg-blue-50 text-blue-700',Antibiotic:'bg-green-50 text-green-700',
  Antidiabetic:'bg-purple-50 text-purple-700',Cardiac:'bg-red-50 text-red-700',
  Antacid:'bg-orange-50 text-orange-700',Antihistamine:'bg-sky-50 text-sky-700',
  Vitamin:'bg-yellow-50 text-yellow-700',Respiratory:'bg-teal-50 text-teal-700',
  Neurological:'bg-indigo-50 text-indigo-700',Ophthalmic:'bg-cyan-50 text-cyan-700',
  Dermatology:'bg-pink-50 text-pink-700',Hormonal:'bg-rose-50 text-rose-700',
  Corticosteroid:'bg-amber-50 text-amber-700',
}
const CAT_BG_TEXT = {
  Analgesic:{bg:'bg-blue-100',text:'text-blue-700'},Antibiotic:{bg:'bg-green-100',text:'text-green-700'},
  Antidiabetic:{bg:'bg-purple-100',text:'text-purple-700'},Cardiac:{bg:'bg-red-100',text:'text-red-700'},
  Antacid:{bg:'bg-orange-100',text:'text-orange-700'},Antihistamine:{bg:'bg-sky-100',text:'text-sky-700'},
  Vitamin:{bg:'bg-yellow-100',text:'text-yellow-700'},Respiratory:{bg:'bg-teal-100',text:'text-teal-700'},
  Neurological:{bg:'bg-indigo-100',text:'text-indigo-700'},Ophthalmic:{bg:'bg-cyan-100',text:'text-cyan-700'},
  Dermatology:{bg:'bg-pink-100',text:'text-pink-700'},Hormonal:{bg:'bg-rose-100',text:'text-rose-700'},
  Corticosteroid:{bg:'bg-amber-100',text:'text-amber-700'},
}
function catBadge(cat)  { return CAT_BADGE[cat]   ?? 'bg-gray-100 text-gray-600' }
function catBgText(cat) { return CAT_BG_TEXT[cat] ?? { bg:'bg-gray-100', text:'text-gray-600' } }
function stockChip(med) {
  if (med.stock === 0)         return 'bg-red-100 text-red-700'
  if (med.stock < med.reorder) return 'bg-amber-100 text-amber-700'
  return 'bg-green-100 text-green-700'
}
function statusBadge(status) {
  return {paid:'bg-green-50 text-green-700 ring-1 ring-green-200',pending:'bg-amber-50 text-amber-700 ring-1 ring-amber-200',refunded:'bg-red-50 text-red-700 ring-1 ring-red-200'}[status] ?? 'bg-gray-100 text-gray-600'
}
function statusDot(status) {
  return {paid:'bg-green-500',pending:'bg-amber-400',refunded:'bg-red-500'}[status] ?? 'bg-gray-400'
}
const AVATAR_COLORS = ['bg-brand-100 text-brand-700','bg-purple-100 text-purple-700','bg-blue-100 text-blue-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700','bg-teal-100 text-teal-700']
function avatarColor(name) { return AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length] }
function paymentIcon(method) {
  return {Cash:BanknotesIcon,Card:CreditCardIcon,'Mobile Banking':DevicePhoneMobileIcon,'Bank Transfer':BuildingLibraryIcon}[method] ?? BanknotesIcon
}
</script>

<style scoped>
.billing-label { @apply block text-[11px] font-semibold text-gray-500 mb-1; }
.billing-input { @apply w-full h-9 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-gray-400; }
.th            { @apply px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap; }
.custom-scroll { scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
.custom-scroll::-webkit-scrollbar       { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
</style>
