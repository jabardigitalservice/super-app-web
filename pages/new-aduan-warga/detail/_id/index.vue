<template>
  <div class="w-full h-full p-4 bg-white min-h-screen">
    <div class="mb-5">
      <TrackingComplaintSearch />
    </div>
    <div
      class="border px-[26px] py-7 border-gray-300 rounded-lg mx-auto flex flex-col gap-[16px]"
    >
      <div class="flex flex-row justify-between">
        <TrackingComplaintHeader />
        <TrackingComplaintBadge class="self-center" status="NONE" />
      </div>

      <hr />

      <TrackingComplaintFooter />
    </div>
  </div>
</template>
