export const metadata = {
  title: 'About Us | Auxbeam',
  description: 'Learn more about Auxbeam, our mission, and our values.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-h2 md:text-h1 mb-8 text-center">About Us</h1>
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-body-lg text-text-secondary mb-6">
            Welcome to Auxbeam. We are dedicated to providing the best products and services to our customers.
            Our journey started with a simple idea: to make high-quality products accessible to everyone.
          </p>
          <p className="text-body-lg text-text-secondary mb-6">
            Over the years, we have grown and expanded our offerings, but our core values remain the same.
            We believe in quality, affordability, and exceptional customer service.
          </p>
          <div className="bg-gray-50 p-8 rounded-lg mt-12">
            <h2 className="text-h4 mb-4">Our Mission</h2>
            <p className="text-body-md text-text-secondary">
              To deliver outstanding value to our customers through continuous innovation, 
              uncompromising quality, and a commitment to excellence in everything we do.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
