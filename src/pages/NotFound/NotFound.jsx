import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
            <p className="text-6xl sm:text-8xl font-extrabold gradient-text">404</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4">Page not found</h1>
            <p className="mt-2 text-base-content/70 max-w-md">
                The page you are looking for doesn&apos;t exist or may have been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link to="/" className="btn btn-primary">
                    Go to Home
                </Link>
                <Link to="/courses" className="btn btn-outline">
                    Browse Courses
                </Link>
            </div>
        </div>
    );
}
