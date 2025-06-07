export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            🏗️ Constructure
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Современная платформа для создания интерактивных образовательных курсов 
            с drag & drop интерфейсом и множественными режимами визуализации
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button className="rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
              Начать создание
            </button>
            <button className="text-sm font-semibold leading-6 text-gray-900">
              Узнать больше <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag & Drop
            </h3>
            <p className="text-gray-600">
              Интуитивное создание курсов перетаскиванием элементов
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              4 режима визуализации
            </h3>
            <p className="text-gray-600">
              Дерево, LEGO-блоки, Mind Map, Flowchart
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Совместная работа
            </h3>
            <p className="text-gray-600">
              Редактирование курсов в реальном времени
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Адаптивный дизайн
            </h3>
            <p className="text-gray-600">
              Работает на всех устройствах и экранах
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 