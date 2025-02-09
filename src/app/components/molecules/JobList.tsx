"use client";
import JobCard from "../atoms/JobCard";

// Definisikan tipe data untuk Job
interface Job {
    id: number;
    title: string;
    category: string;
    location: string;
    salary: string;
    status: string;
}

// Definisikan tipe props untuk JobList
interface JobListProps {
    jobs: Job[];
    loading: boolean;
    error: string;
}

export default function JobList({ jobs, loading, error }: JobListProps) {
    return (
        <div className="container mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Latest Job Listings</h3>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : jobs.length === 0 ? (
                <p className="text-center text-gray-500">No jobs found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}
