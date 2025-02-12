"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SidebarEmployer from "../../../../components/layout/SidebarEmployer";
import HeaderEmployer from "../../../../components/layout/HeaderEmployer";
import "../../../../dashboard.css";

interface JobAssignment {
    id: number;
    job_application_id: number;
    job_id: number;
    assigned_at: string;
    completed_at: string | null;
    status: string;
    rating: number | null;
    review: string | null;
    JobApplication: {
        id: number;
        status: string;
        user_id: number;
        job_id: number;
        Job: {
            id: number;
            title: string;
            description: string;
            salary: string;
            location: string;
        };
    };
}

const JobAssignmentPage = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [assignment, setAssignment] = useState<JobAssignment | null>(null);
    const [walletId, setWalletId] = useState<number | null>(null); // New state to store wallet ID
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Store payment status
    const [idOrderMidtrans, setIdOrderMidtrans] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const params = useParams();
    const id = params.id; // ID from the job assignment
    console.log("test id dapet gk", params.id);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    // Fetch job assignment based on ID
    useEffect(() => {
        if (id) {
            const fetchAssignment = async () => {
                try {
                    const response = await fetch(`https://dailyquest.space/api/v1/job-assigment/${params.id}`);
                    const data = await response.json();
                    console.log("Job Assignment Data:", data);

                    console.log("test id dapet gk ini id user ye", data.data.JobApplication.user_id);
                    if (data.success) {
                        setAssignment(data.data);
                        // Fetch the wallet ID for the worker using the user_id from the assignment
                        await fetchWalletId(data.data.JobApplication.user_id);
                    } else {
                        setError("Job assignment not found");
                    }
                } catch (error) {
                    console.error("Error fetching job assignment:", error);
                    setError("An error occurred while fetching the data");
                } finally {
                    setLoading(false);
                }
            };

            fetchAssignment();
        }
    }, [id]);

    // Fetch wallet ID based on user ID
    const fetchWalletId = async (userId: number) => {
        try {
            const response = await fetch(`https://dailyquest.space/api/v1/wallet/${userId}`);
            const data = await response.json();
            console.log("Wallet Data coek:", data.data.id);

            if (data.success) {
                setWalletId(data.data.id); // Assuming wallet data contains an `id` field
            } else {
                setError("Wallet not found");
            }
        } catch (error) {
            console.error("Error fetching wallet:", error);
            setError("An error occurred while fetching the wallet");
        }
    };

    // Function to mark job as complete and process payment
    const markAsComplete = async () => {
        if (!assignment || walletId === null) return;

        try {
            // **1. Update Job Assignment Status to "Completed"**
            const assignmentResponse = await fetch("https://dailyquest.space/api/v1/job-assigment", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: assignment.id, // Assignment ID
                    status: "Completed",
                }),
            });

            const assignmentData = await assignmentResponse.json();
            console.log("Assignment Response:", assignmentData);

            if (!assignmentData.success) {
                alert("Failed to mark job as completed. Try again.");
                return;
            }

            // **2. Proceed with Payment**
            const paymentPayload = {
                job_id: assignment.job_id,
                worker_id: assignment.JobApplication.user_id, // Worker ID from JobApplication
                amount: parseInt(assignment.JobApplication.Job.salary), // Job salary
                transaction_type: "Payment",
                wallet_id: walletId, // Use the fetched wallet ID
            };

            const paymentResponse = await fetch("https://dailyquest.space/api/v1/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(paymentPayload),
            });

            const paymentData = await paymentResponse.json();
            console.log("Payment Response:", paymentData);

            if (!paymentData.success) {
                alert("Payment failed.");
                return;
            }

            // **3. Update UI and notify success**
            setAssignment((prev) => prev ? { ...prev, status: "Completed" } : null);
            alert("Job completed and payment successful!");

            // **4. Redirect to Midtrans payment page**
            const midtransRedirectUrl = paymentData.data.midtrans_transaction.transaction.redirect_url;
            if (paymentData.success) {
                setIdOrderMidtrans(paymentData.data.midtrans_transaction.midtrans_order_id);
                console.log("ada gk,", idOrderMidtrans)
            } else {
                setError("Job assignment not found");
            }
            console.log("ini redirect url", midtransRedirectUrl)
            if (midtransRedirectUrl) {
                window.open(midtransRedirectUrl, '_blank');
                // Redirect to payment page
            } else {
                alert("Payment successful, but no redirect URL found.");
            }
        } catch (error) {
            console.error("Error in completing job and processing payment:", error);
            alert("An error occurred, try again.");
        }
    };
    console.log("ini order id kocak", idOrderMidtrans)

    // Function to check payment status
    const checkPayment = async () => {
        if (!assignment || !idOrderMidtrans) return;

        const orderId = idOrderMidtrans; // Use the order ID from the state

        try {
            // Send the order_id in the body using POST method
            const response = await fetch("https://dailyquest.space/api/v1/payment/status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Include Authorization token
                },
                body: JSON.stringify({
                    midtrans_order_id: orderId, // Construct the order_id as required
                })
            });

            const data = await response.json();
            if (data.success) {
                setPaymentStatus(data.data.payment.status); // Store the payment status
                alert(`Payment status: ${data.data.payment.status}`);
            } else {
                setError("Failed to retrieve payment status");
            }
        } catch (error) {
            console.error("Error fetching payment status:", error);
            setError("An error occurred while checking the payment status");
        }
    };



    return (
        <div className="dashboard flex">
            {/* Sidebar */}
            <SidebarEmployer
                isSidebarMinimized={isSidebarMinimized}
                toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
            />

            {/* Main Content */}
            <div className="main-content flex-1">
                <HeaderEmployer
                    isProfileMenuOpen={isProfileMenuOpen}
                    toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                />

                <main className="dashboard-content">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : assignment ? (
                        <div className="assignment-card bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detail Assignment</h2>

                            {/* Job Information */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Job: {assignment.JobApplication.Job.title}</h3>
                                <p className="text-gray-600">{assignment.JobApplication.Job.description}</p>
                                <p className="text-gray-600"><strong>Location:</strong> {assignment.JobApplication.Job.location}</p>
                                <p className="text-gray-600"><strong>Salary:</strong> Rp {assignment.JobApplication.Job.salary}</p>
                            </div>

                            {/* Applicant Information */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Applicant</h3>
                                <p className="text-gray-600"><strong>Username:</strong> {assignment.JobApplication.user_id}</p>
                                <p className="text-gray-600"><strong>Application Status:</strong> {assignment.JobApplication.status}</p>
                            </div>

                            {/* Assignment Status */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Assignment Status</h3>
                                <p className={`text-sm font-semibold px-3 py-1 rounded ${assignment.status === "Assigned" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                                    {assignment.status}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6">
                                {assignment.status === "Assigned" && (
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded shadow" onClick={markAsComplete}>
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                            <div className="mt-6">
                                {assignment.status === "Completed" && (
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded shadow" onClick={checkPayment}>
                                        Cek Status Pembayaran
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600">Data not found.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobAssignmentPage;
