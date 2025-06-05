import React from 'react';
import { Radio, Globe, Music, Users, Heart, Headphones, Search, Play } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'Global Coverage',
      description: 'Access thousands of radio stations from every corner of the world, bringing diverse cultures and music to your fingertips.'
    },
    {
      icon: <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'Multiple Genres',
      description: 'Explore a wide range of music genres, talk shows, news broadcasts, and more, all categorized for easy discovery.'
    },
    {
      icon: <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'Favorites',
      description: 'Create your personal collection by saving your favorite stations for quick access anytime.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'High-Quality Streaming',
      description: 'Enjoy crystal-clear audio with our high-quality streaming capabilities and adjustable volume controls.'
    }
  ];

  const stats = [
    { label: 'Radio Stations', value: '30,000+' },
    { label: 'Countries', value: '150+' },
    { label: 'Languages', value: '100+' },
    { label: 'Genres', value: '500+' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Radio className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About GlobalRadio</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your gateway to worldwide radio broadcasting, bringing diverse cultures and music together in one seamless platform.
        </p>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
          Why Choose GlobalRadio?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-purple-50 dark:bg-purple-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">How to Use GlobalRadio</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">1. Discover</h3>
            <p className="text-purple-100">
              Search for stations by name, country, or genre using our powerful search feature.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">2. Listen</h3>
            <p className="text-purple-100">
              Click play on any station to start streaming high-quality audio instantly.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">3. Save</h3>
            <p className="text-purple-100">
              Add stations to your favorites for quick access to your preferred content.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <a
          href="mailto:contact@globalradio.com"
          className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          <Users className="w-5 h-5 mr-2" />
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;