<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import QRCode from 'qrcode';

// Define QR Code types
type QrType = 'url' | 'text' | 'email' | 'wifi';

const qrType = ref<QrType>('url'); // Default type
const qrCodeDataUrl = ref('/example_qr.jpeg'); // Default/placeholder QR code image

// Input fields for different QR types
const url = ref('');
const text = ref('');
const emailAddress = ref('');
const emailSubject = ref('');
const emailBody = ref('');
const wifiSsid = ref('');
const wifiPassword = ref('');
const wifiEncryption = ref<'WPA' | 'WEP' | 'nopass'>('WPA'); // Default encryption

// QR Code Size
const availableSizes = [128, 256, 512, 1024];
const qrSize = ref<number>(256); // Default size

// Computed property to get the data string based on the selected type and inputs
const qrDataString = computed(() => {
  switch (qrType.value) {
    case 'url':
      return url.value;
    case 'text':
      return text.value;
    case 'email':
      let mailto = `mailto:${emailAddress.value}`;
      if (emailSubject.value) mailto += `?subject=${encodeURIComponent(emailSubject.value)}`;
      if (emailBody.value) mailto += `${emailSubject.value ? '&' : '?'}body=${encodeURIComponent(emailBody.value)}`;
      return mailto;
    case 'wifi':
      // Format: WIFI:T:<encryption>;S:<ssid>;P:<password>;;
      if (!wifiSsid.value) return '';
      let wifiString = `WIFI:T:${wifiEncryption.value};S:${wifiSsid.value};`;
      if (wifiEncryption.value !== 'nopass' && wifiPassword.value) {
        wifiString += `P:${wifiPassword.value};`;
      }
      wifiString += ';';
      return wifiString;
    default:
      return '';
  }
});

const generateQrCode = async () => {
  const data = qrDataString.value;
  if (!data) {
    qrCodeDataUrl.value = '/example_qr.jpeg'; // Reset if input is empty
    return;
  }
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'L', // Low error correction
      margin: 4,
      scale: 10, // Scale might need adjustment based on width, but width is primary control
      width: qrSize.value // Use selected size
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    qrCodeDataUrl.value = '/example_qr.jpeg'; // Show default image on error
  }
};

// Download QR Code Function
const downloadQrCode = () => {
  if (!qrCodeDataUrl.value || qrCodeDataUrl.value === '/example_qr.jpeg') {
    alert('Please generate a QR code first.');
    return;
  }
  const link = document.createElement('a');
  link.href = qrCodeDataUrl.value;
  link.download = `qr-code-${qrSize.value}x${qrSize.value}.png`; // Dynamic filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Watch for changes in relevant inputs and regenerate QR code
watch([qrType, url, text, emailAddress, emailSubject, emailBody, wifiSsid, wifiPassword, wifiEncryption, qrSize], generateQrCode, { deep: true });

// Initial generation in case there's default data
generateQrCode();

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

      <!-- Left Column: Description and Type Selection -->
      <div class="space-y-6">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">QR Code Generator</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Create custom QR codes instantly. Select the type of content you want to encode, fill in the details, and your QR code will appear on the right.
        </p>

        <!-- QR Type Selection -->
        <div>
          <label for="qrTypeSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select QR Code Type:</label>
          <select
            id="qrTypeSelect"
            v-model="qrType"
            onchange="window.umami.track('qrTypeSelect:Change',{type:'select',value:document.getElementById('qrTypeSelect').value})"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
          >
            <option value="url">URL</option>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="wifi">WiFi Network</option>
          </select>
        </div>

        <!-- QR Size Selection -->
        <div>
          <label for="qrSizeSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select QR Code Size:</label>
          <select
            id="qrSizeSelect"
            v-model="qrSize"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"
          >
            <option v-for="size in availableSizes" :key="size" :value="size">{{ size }}x{{ size }}</option>
          </select>
        </div>
      </div>

      <!-- Right Column: Inputs and QR Code Preview -->
      <div class="space-y-6">
        <!-- Input Section -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Enter Details</h2>

          <!-- URL Input -->
          <div v-if="qrType === 'url'">
            <label for="urlInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
            <input type="url" id="urlInput" v-model="url" placeholder="https://example.com" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200" />
          </div>

          <!-- Text Input -->
          <div v-if="qrType === 'text'">
            <label for="textInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Text</label>
            <textarea id="textInput" v-model="text" placeholder="Enter any text" rows="4" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"></textarea>
          </div>

          <!-- Email Inputs -->
          <div v-if="qrType === 'email'" class="space-y-3">
            <div>
              <label for="emailAddressInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input type="email" id="emailAddressInput" v-model="emailAddress" placeholder="recipient@example.com" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200" />
            </div>
            <div>
              <label for="emailSubjectInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject (Optional)</label>
              <input type="text" id="emailSubjectInput" v-model="emailSubject" placeholder="Email Subject" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200" />
            </div>
            <div>
              <label for="emailBodyInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body (Optional)</label>
              <textarea id="emailBodyInput" v-model="emailBody" placeholder="Email body text..." rows="3" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200"></textarea>
            </div>
          </div>

          <!-- WiFi Inputs -->
          <div v-if="qrType === 'wifi'" class="space-y-3">
            <div>
              <label for="wifiSsidInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Network Name (SSID)</label>
              <input type="text" id="wifiSsidInput" v-model="wifiSsid" placeholder="YourNetworkName" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200" />
            </div>
            <div>
              <label for="wifiPasswordInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password (Optional if no encryption)</label>
              <input type="password" id="wifiPasswordInput" v-model="wifiPassword" placeholder="YourPassword" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200" :disabled="wifiEncryption === 'nopass'" />
            </div>
            <div>
              <label for="wifiEncryptionSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Encryption</label>
              <select id="wifiEncryptionSelect" v-model="wifiEncryption" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Encryption</option>
              </select>
            </div>
          </div>
        </div>

        <!-- QR Code Preview Section -->
        <div class="flex flex-col items-center space-y-4">
           <div class="p-2 bg-white rounded-lg shadow-md inline-block">
             <img
               :src="qrCodeDataUrl"
               alt="Generated QR Code"
               class="object-contain"
               :style="{ width: qrSize + 'px', height: qrSize + 'px' }"
               id="qrCodeImage"
             />
           </div>
           <p class="text-center text-sm text-gray-500 dark:text-gray-400">QR Code Preview ({{ qrSize }}x{{ qrSize }})</p>
           <!-- Download Button -->
           <button
             @click="downloadQrCode"
             :disabled="!qrDataString || qrCodeDataUrl === '/example_qr.jpeg'"
             class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Download QR Code
           </button>
         </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Remove fixed min-width/height to allow dynamic sizing */
</style>
