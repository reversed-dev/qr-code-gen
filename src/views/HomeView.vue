<script setup lang="ts">
</script>

<template>
  <main>
    <div>
      <h2 class="green">Your URL</h2>
      <input type="url" name="url" id="url" alt="Your URL to make to a QR Code" oninput='var qr = qrcode(4, "L");qr.addData(document.getElementById("url").value);qr.make();document.getElementById("placeHolder").src = qr.createDataURL();'>
    </div>
    <div style="margin-top: 10px;">
      <div>
        <img src="" alt="Your QR Code" width="30%" height="30%" id="placeHolder">
      </div>
    </div>
  </main>
</template>
