// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MN</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoviesFlix
              </span>
            </div>
            <p className="mt-4 text-gray-300 max-w-md">
              Your ultimate destination for downloading the latest movies from
              all platforms. We offer high-quality downloads for Hollywood,
              Bollywood, Netflix, Prime, Hulu and more.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold">Platforms</h3>
            <ul className="mt-4 space-y-2">
              {[
                "Hollywood",
                "Bollywood",
                "Netflix",
                "Prime",
                "Hulu",
                "Disney+",
                "HBO Max",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              {["Terms of Service", "Privacy Policy", "DMCA", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MoviesFlix. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <a
                key={i}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Social media</span>
                <div className="h-6 w-6 bg-gray-600 rounded-full"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
