import { useEffect, useState } from "react";

export default function APIDocs() {
    return (
        <div className="float-start px-10 pt-5 h-screen">
            <div className="overflow-y-auto hide-scrollbar"
                style={{ height: "calc(100vh - 100px)" }}
            >
                {/* Badge */}
                <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 mt-5 rounded-full mb-4">
                    Payment Gateway API
                </span>

                {/* Heading */}
                <h1 className="text-4xl font-bold text-blue-900 mb-4">
                    HelloPe Payment Gateway API
                </h1>

                {/* Description */}
                <p className="text-gray-700 leading-7 mb-10">
                    Welcome to the HelloPe Payment Gateway API documentation.
                    This guide will help you integrate HelloPe's payment
                    processing services into your application, allowing you to
                    manage transactions, process payments, and handle orders
                    seamlessly.
                </p>

                {/* API Overview */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-8 mb-10">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                        API Overview
                    </h2>

                    <p className="text-gray-700 leading-7">
                        HelloPe Payment Gateway provides a robust set of REST APIs
                        that enable businesses to securely accept, process, and
                        manage online payments.
                    </p>

                    <p className="text-gray-700 leading-7 mt-4">
                        Whether you're processing one-time payments, recurring
                        billing, subscription payments, or handling complex payment
                        workflows, HelloPe offers all the tools you need to get
                        started quickly and efficiently.
                    </p>
                </div>

                {/* Environment */}
                <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                    Production and Sandbox Environments
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* Production */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-red-600 tracking-widest uppercase mb-4">
                            Production
                        </h3>

                        <p className="text-gray-700 mb-6">
                            Use this endpoint when you're ready to process live
                            transactions. All requests interact with your live account
                            and real funds will be involved.
                        </p>

                        <div className="bg-gray-100 rounded-md px-4 py-3 font-mono text-sm text-gray-800">
                            Base URL: https://pay.hellope.co.in/
                        </div>
                    </div>

                    {/* Sandbox */}
                    {/* <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-orange-600 tracking-widest uppercase mb-4">
                            Sandbox
                        </h3>

                        <p className="text-gray-700 mb-6">
                            Use this endpoint during development and testing. The
                            sandbox environment simulates real payment processing
                            without moving actual funds.
                        </p>

                        <div className="bg-gray-100 rounded-md px-4 py-3 font-mono text-sm text-gray-800">
                            Base URL: https://pay.hellope.co.in/
                        </div>
                    </div> */}

                </div>

                {/* Need Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                        Need Help?
                    </h2>

                    <p className="text-gray-700 mb-6">
                        Our developer support team is here to assist you with API integration,
                        testing, production onboarding, and troubleshooting.
                    </p>

                    <div className="space-y-3 text-gray-700">
                        <div>
                            <a
                                href="mailto:support@hellope.co.in"
                                className="text-blue-600 hover:underline"
                            >
                                support@hellope.co.in
                            </a>
                        </div>

                        <div>
                            <span className="font-semibold">🚀 Integration Support:</span> Sandbox setup, Production onboarding, Webhooks, API troubleshooting, and Payment Gateway assistance.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}