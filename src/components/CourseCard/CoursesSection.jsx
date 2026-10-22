import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courses.api";
import CoursesFilters from "./CoursesFilters";
import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

export default function CoursesSection() {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // query states
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [search, setSearch] = useState(""); // what is typed in the search box
    const [query, setQuery] = useState(""); // search text that is actually applied
    const [sort, setSortValue] = useState("");
    const [category, setCategoryValue] = useState("");
    const [tags, setTagsValue] = useState("");

    // changing a filter also goes back to page 1 in the same update, so only one request is sent
    const withFirstPage = (setter) => (value) => {
        setter(value);
        setPage(1);
    };
    const setSort = withFirstPage(setSortValue);
    const setCategory = withFirstPage(setCategoryValue);
    const setTags = withFirstPage(setTagsValue);

    useEffect(() => {
        let cancelled = false;

        const loadCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getCourses({
                    page,
                    limit,
                    search: query || undefined,
                    sort: sort || undefined,
                    category: category || undefined,
                    tags: tags || undefined,
                });
                if (cancelled) return;
                setCourses(res.data.courses || []);
                setTotalPages(res.data.totalPages || 1);
            } catch {
                if (!cancelled) setError("Failed to load courses");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadCourses();
        // ignore the response of a request that was replaced by a newer one
        return () => {
            cancelled = true;
        };
    }, [page, limit, query, sort, category, tags]);

    const onSearchSubmit = (e) => {
        e.preventDefault();
        setQuery(search.trim());
        setPage(1);
    };

    return (
        <div className="space-y-6">

            <CoursesFilters
                search={search} setSearch={setSearch}
                sort={sort} setSort={setSort}
                category={category} setCategory={setCategory}
                tags={tags} setTags={setTags}
                onSearchSubmit={onSearchSubmit}
            />

            {/* states */}
            {loading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="rounded-xl border border-primary/20 bg-base-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-primary">
                        No courses found
                    </h3>
                    <p className="mt-1 text-base-content/70">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}


            {!loading && !error && courses.length > 0 && (
                <>
                    <CoursesGrid courses={courses} />
                    {user?.role === "admin" && (
                        <div className="flex justify-center pt-4">
                            <Link
                                to="/admin/courses"
                                className="btn btn-primary btn-wide"
                            >
                                Manage Courses
                            </Link>
                        </div>
                    )}
                </>
            )}

            <CoursesPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    );
}
