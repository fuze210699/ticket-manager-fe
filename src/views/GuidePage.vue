<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-6 text-gray-900">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('guide.title') }}</h1>
            <p class="mt-2 text-lg text-gray-600">{{ $t('guide.subtitle') }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('guide.gettingStarted') }}</h3>
              <p class="mt-2 text-sm text-gray-500">Tìm hiểu cách bắt đầu sử dụng Ticket Manager</p>
            </div>

            <div class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('guide.features') }}</h3>
              <p class="mt-2 text-sm text-gray-500">Khám phá các tính năng mạnh mẽ của Ticket Manager</p>
            </div>

            <div class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('guide.tutorials') }}</h3>
              <p class="mt-2 text-sm text-gray-500">Xem các hướng dẫn chi tiết về cách sử dụng</p>
            </div>

            <div class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('guide.faq') }}</h3>
              <p class="mt-2 text-sm text-gray-500">Tìm câu trả lời cho các câu hỏi thường gặp</p>
            </div>

            <div class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('guide.contact') }}</h3>
              <p class="mt-2 text-sm text-gray-500">Liên hệ với đội ngũ hỗ trợ khi cần giúp đỡ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
