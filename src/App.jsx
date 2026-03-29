import React from 'react';
import logoIcon from './assets/logo-icon.png';
import logoFull from './assets/logo-full.jpeg';
import heroImage from './assets/hero.png';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Logo Icon" className="h-10 w-10" />
            <img src={logoFull} alt="Logo Full" className="h-8" />
          </div>
          <nav className="flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600">About</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Fetch R Latest</h1>
          <p className="text-xl text-gray-600 mb-8">Your one-stop solution for fetching the latest data</p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition">Get Started</button>
        </section>
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast</h3>
            <p className="text-gray-600">Lightning-fast data fetching and processing</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable</h3>
            <p className="text-gray-600">Dependable service you can count on</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy</h3>
            <p className="text-gray-600">Simple and intuitive to use</p>
          </div>
        </section>
        {heroImage && (
          <section className="mb-12">
            <img src={heroImage} alt="Hero" className="w-full rounded-lg shadow-lg" />
          </section>
        )}
      </main>
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; 2024 Fetch R Latest. All rights reserved.</p>
      </footer>
    </div>
  );
}