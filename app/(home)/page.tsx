import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <header className="text-center py-10">
        <div className="flex flex-row items-center justify-center space-x-4">
          <img
            src="/assets/clarifythink.png"
            alt="thinking"
            width={50}
            height={50}
            style={{ transform: 'scaleX(-1)' }}
          />
          <h1 className="text-4xl font-bold text-gray-800">
            Clarify <span className="text-blue-500">AI</span>
          </h1>
          <img
            src="/assets/clarifythumbsup.png"
            alt="thumbs up"
            width={50}
            height={50}
          />
        </div>
      </header>
      <main className="flex flex-col gap-10">
        <section className="text-center py-16 bg-gray-100 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">
            Discover a new way to conduct surveys and interviews
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Embrace the power of Clarify to autonomously conduct semi-structured
            interviews that extract the maximum amount of information from your
            users by asking the right questions at the right time.
          </p>
          <Link href="/new">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </Link>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Intuitive interface for seamless response collection.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Flexible</h3>
            <p className="text-gray-600">
              Customize your interview and goals to answer your burning
              questions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Widely Distributable</h3>
            <p className="text-gray-600">
              One link to gather rich responses from thousands of participants.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
