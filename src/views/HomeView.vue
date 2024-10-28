<script setup lang="ts">
</script>

<template>
  <main>
    <div>
      <h2 class="green">Any Data</h2>
      <p>You can Input actually anything. If you want it to be a link, paste a link...</p>
      <input type="text" name="userdata" id="userdata" alt="Your URL to make to a QR Code" oninput='var qr = qrcode(4, "L");qr.addData(document.getElementById("userdata").value);qr.make();document.getElementById("placeHolder").src = qr.createDataURL();'>
    </div>
    <div style="margin-top: 10px;">
      <div>
        <img src="/waiting.png" alt="Your QR Code" width="30%" height="30%" id="placeHolder">
      </div>
    </div>
  </main>
</template>
