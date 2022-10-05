<template>
  <div>
    <div class="container-box">
      <div class="logo">
        <div class="circle">
          <img width="24" height="33.38" src="~/assets/images/logo.svg" alt="logo sapawarga">
        </div>
        <span class="logo-typo">Sapawarga</span>
      </div>
      <div class="content-box">
        <div class="content-card">
          <div class="circle-icon">
            <img v-if="isVerified" width="73.07" height="73.07" src="~/assets/images/ktp.svg" alt="icon ktp">
            <img v-else width="73.07" height="73.07" src="~/assets/images/invalid.svg" alt="icon invalid link">
          </div>
          <h1 v-if="isVerified" class="heading">
            Selamat!
          </h1>
          <h1 v-else class="heading">
            Link verifikasi sudah tidak valid!
          </h1>
          <p v-if="isVerified" class="text-information">
            Akun Anda telah terverifikasi. Silakan login pada aplikasi Sapawarga.
          </p>
          <p v-else class="text-information">
            Harap untuk menggunakan link verifikasi yang masih aktif.
          </p>
          <div class="email">
            Email: <span class="link">admin@gmail.com</span>
          </div>
          <div class="thanks">
            Terima kasih.
          </div>
          <div class="info">
            <img src="~/assets/images/warning.svg" alt="icon warning">
            <div>
              <div>
                Tidak merasa melakukan aktifitas ini, silahkan hubungi tim support kami di
              </div>
              <div class="link">
                support@sapawarga.jabarprov.go.id
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VerificationRegistrationPage',
  async asyncData ({ $axios, query }) {
    let isVerified = false
    const queryToken = query.token

    // if query token is exist
    if (queryToken) {
      // extract token & userid
      const dataDecoded = Buffer.from(queryToken, 'base64').toString('utf-8') // decode to string from base46
      const token = dataDecoded.split(':')[0] // get token from result data decode
      const userId = dataDecoded.split(':')[1] // get userId from result data userId
      try {
        // request verification token
        await $axios.post('/v1/user/auth/verify/registration', {
          token,
          userId
        })

        // token valid and verified
        isVerified = true
      } catch (error) {
        // silent error
      }
    }

    return {
      isVerified
    }
  }
}
</script>

<style scoped>
.heading{
  font: Roboto, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 26px;
  margin: 8px 0 8px 0;
}

.container-box {
  display: block;
  padding: 16px;
  height: 100vh;
}

.logo-typo {
  font-family: Roboto, sans-serif;
  font-weight: 700;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-icon {
  width: 73.07px;
  height: 73.07px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  margin-bottom: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.content-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-card {
  border-radius: 8px;
  padding: 16px;
  font-weight: 400;
  font-size: 12px;
  line-height: 19px;
  width: 360px;
}

.text-information {
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
  margin-bottom: 12px;
}

.p2 {
  margin-top: 22px;
}

.btn-verification {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: 100%;
  background-color: #16A75C;
  color: white;
  border: none;
  border-radius: 8px;
  line-height: 20px;
  font-weight: bold;
  font-size: 14px;
  text-decoration: none;
}

.email {
  margin-top: 16px;
}

.thanks {
  margin-top: 16px;
}

.link {
  color: #1E88E5;
}

.info {
  border-radius: 8px;
  width: 100%;
  margin-top: 16px;
  line-height: 18px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
}

@media (prefers-color-scheme: light) {
  .container-box {
    background-color: #eff2f3;
  }

  .logo-typo {
    color: #212121;
  }

  .content-card {
    background-color: white;
    color: #424242;
  }

  .circle {
    background-color: #FFFFFF;;
  }

  .circle-icon, .info {
    background-color: #FAFAFA;
  }
}

@media (prefers-color-scheme: dark) {
  .container-box {
    background-color: #111313;;
  }

  .logo-typo {
    color: #868C89;
  }

  .content-card {
    background-color: #1F2121;;
    color: #AAB0B7;;
  }

  .circle {
    background-color: #1F2121;
  }

  .circle-icon, .info {
    background-color: #292C2A;
  }
}
</style>
