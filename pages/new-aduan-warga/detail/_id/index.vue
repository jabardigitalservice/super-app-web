<template>
  <section class="w-full h-full rounded-xl px-0 py-3 sm:p-3 md:p-4 lg:p-10">
    <BaseContainer>
      <div
        class="p-3 md:p-4 lg:p-6 xl:py-8 xl:px-10 rounded-xl bg-white min-h-screen"
      >
        <div class="mb-5">
          <TrackingComplaintSearch />
        </div>
        <div
          class="border px-[26px] py-7 border-gray-300 rounded-lg max-w-[1280px] mx-auto flex flex-col gap-[16px]"
        >
          <div class="flex flex-row justify-between">
            <!-- Header -->
            <TrackingComplaintHeader />
            <TrackingComplaintBadge class="self-center" status="NONE" />
          </div>

          <hr />

          <div class="flex flex-col gap-2">
            <!-- info -->
            <h3 class="font-lato text-sm font-medium text-black">
              Laporan Aduan
            </h3>
            <div class="flex flex-col gap-2 md:flex-row md:justify-between">
              <p class="font-lato text-[12px] leading-[18px] text-gray-500">
                Diadukan pada: <span>Senin, 11 Maret 2024</span>
              </p>
              <p class="font-lato text-[12px] leading-[18px] text-gray-500">
                Update Terbaru: <span> Senin, 14 Maret 2024 </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
