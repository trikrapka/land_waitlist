<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')

async function handleSubmit() {
  if (!email.value) return
  
  status.value = 'loading'
  try {
    const response = await fetch('/api/submit-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    
    if (response.ok) {
      status.value = 'success'
      message.value = "You're on the list! We'll be in touch soon."
      email.value = ''
    } else {
      throw new Error('Something went wrong. Please try again.')
    }
  } catch (err: any) {
    status.value = 'error'
    message.value = err.message || 'Something went wrong.'
  }
}
</script>

<template>
  <div class="app-wrapper">
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <div class="container">
      <header>
        <div class="logo">Sequel</div>
      </header>

      <section class="content">
        <h1>
          <span>Your Second Act</span>
          <span>Awaits.</span>
        </h1>
        <p class="tagline">
          Dating, reshaped for intentionality. Discover a community where depth matters more than distance.
        </p>

        <div class="waitlist-card">
          <div class="coming-soon-badge">Coming Soon</div>
          <h2>Join the Exclusive Waitlist</h2>
          <p>Be the first to know when we open our doors.</p>
          
          <form @submit.prevent="handleSubmit" class="form-group">
            <input 
              v-model="email" 
              type="email" 
              placeholder="Enter your email address" 
              required
              :disabled="status === 'loading'"
            />
            <button type="submit" :disabled="status === 'loading'">
              {{ status === 'loading' ? 'Joining...' : 'Join the Waitlist' }}
            </button>
          </form>
          
          <p v-if="message" :class="['status-msg', status]">{{ message }}</p>
        </div>
      </section>
    </div>

    <footer>
      &copy; 2026 Sequel. Sleekwell Corp.
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  --primary: #5A68E9;
  --accent: #FBB9A5;
  --warm: #FFD3A9;
  --dark: #1a1a2e;
  --light: #f8f9fb;
  
  font-family: 'Roboto Flex', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, var(--warm) 0%, var(--accent) 30%, var(--primary) 100%);
  color: var(--dark);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: relative;
}

.container {
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  text-align: center;
  padding: 40px 0;
  z-index: 10;
}

/* Abstract Animated Background Shapes */
.bg-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  filter: blur(80px);
  opacity: 0.5;
  border-radius: 50%;
  animation: move 20s infinite alternate;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: var(--warm);
  top: -100px;
  left: -100px;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  bottom: -50px;
  right: -50px;
  animation-duration: 25s;
}

@keyframes move {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(10% , 10%) scale(1.1); }
}

/* Content Styling */
header {
  margin-bottom: 40px;
  animation: fadeInDown 1s ease-out;
}

.content {
  animation: fadeInUp 1s ease-out 0.2s both;
}

.logo {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  margin-bottom: 10px;
  display: inline-block;
}

h1 {
  font-size: clamp(40px, 8vw, 72px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: white;
  margin-bottom: 24px;
}

h1 span {
  display: block;
  opacity: 0.95;
}

.tagline {
  font-size: clamp(18px, 4vw, 24px);
  color: white;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 48px auto;
  line-height: 1.4;
  font-weight: 400;
}

/* Waitlist Card */
.waitlist-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 48px;
  max-width: 560px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.coming-soon-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}

.waitlist-card h2 {
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.waitlist-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  font-size: 16px;
  line-height: 1.5;
}

.form-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

input[type="email"] {
  flex: 1;
  min-width: 250px;
  padding: 18px 24px;
  border-radius: 12px;
  border: none;
  background: white;
  font-family: inherit;
  font-size: 16px;
  color: var(--dark);
  outline: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

button {
  padding: 18px 32px;
  border-radius: 12px;
  border: none;
  background: var(--dark);
  color: white;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  background: #000;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-msg {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}
.status-msg.success { color: white; background: rgba(74, 222, 128, 0.2); padding: 10px; border-radius: 8px; }
.status-msg.error { color: #f87171; }

footer {
  margin-top: auto;
  padding: 40px;
  color: white;
  opacity: 0.6;
  font-size: 14px;
  z-index: 10;
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 600px) {
  .waitlist-card {
    padding: 32px 24px;
  }
  .form-group {
    flex-direction: column;
  }
  input[type="email"], button {
    width: 100%;
  }
}
</style>
