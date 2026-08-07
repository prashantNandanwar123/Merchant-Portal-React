import { useEffect, useState } from "react";

export default function APIDocs() {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-6 py-4 sm:py-6 xl:py-3 h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar">
            <div>
                {/* Badge */}
                <span className="inline-block bg-red-100 text-red-600 text-xs xl:text-[11px] font-semibold px-3 xl:px-2.5 py-1 xl:py-0.5 mt-5 xl:mt-2 rounded-full mb-4 xl:mb-2">
                    Payment Gateway API
                </span>

                {/* Heading */}
                <h1 className="text-4xl xl:text-2xl font-bold text-blue-900 mb-4 xl:mb-2">
                    HelloPe Payment Gateway API
                </h1>

                {/* Description */}
                <p className="text-gray-700 leading-7 xl:leading-5 mb-10 xl:mb-5">
                    Welcome to the HelloPe Payment Gateway API documentation.
                    This guide will help you integrate HelloPe's payment
                    processing services into your application, allowing you to
                    manage transactions, process payments, and handle orders
                    seamlessly.
                </p>

                {/* API Overview */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-8 xl:p-5 mb-10 xl:mb-5">
                    <h2 className="text-2xl xl:text-lg font-semibold text-blue-900 mb-4 xl:mb-2">
                        API Overview
                    </h2>

                    <p className="text-gray-700 leading-7 xl:leading-5">
                        HelloPe Payment Gateway provides a robust set of REST APIs
                        that enable businesses to securely accept, process, and
                        manage online payments.
                    </p>

                    <p className="text-gray-700 leading-7 xl:leading-5 mt-4 xl:mt-2">
                        Whether you're processing one-time payments, recurring
                        billing, subscription payments, or handling complex payment
                        workflows, HelloPe offers all the tools you need to get
                        started quickly and efficiently.
                    </p>
                </div>

                {/* Environment */}
                <h2 className="text-2xl xl:text-lg font-semibold text-blue-900 mb-6 xl:mb-3">
                    Production and Sandbox Environments
                </h2>

                <div className="grid md:grid-cols-2 gap-6 xl:gap-3 mb-10 xl:mb-5">
                    {/* Production */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 xl:p-4">
                        <h3 className="text-sm xl:text-xs font-bold text-red-600 tracking-widest uppercase mb-4 xl:mb-2">
                            Production
                        </h3>

                        <p className="text-gray-700 mb-6 xl:mb-3 leading-6 xl:leading-5">
                            Use this endpoint when you're ready to process live
                            transactions. All requests interact with your live account
                            and real funds will be involved.
                        </p>

                        <div className="bg-gray-100 rounded-md px-4 xl:px-3 py-3 xl:py-2 font-mono text-sm xl:text-xs text-gray-800">
                            Base URL: https://pay.hellope.co.in/
                        </div>
                    </div>
                </div>

                {/* Need Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 xl:p-5">
                    <h2 className="text-2xl xl:text-lg font-semibold text-blue-900 mb-4 xl:mb-2">
                        Need Help?
                    </h2>

                    <p className="text-gray-700 mb-6 xl:mb-3 leading-6 xl:leading-5">
                        Our developer support team is here to assist you with API integration,
                        testing, production onboarding, and troubleshooting.
                    </p>

                    <div className="space-y-3 xl:space-y-2 text-gray-700">
                        <div>
                            <a
                                href="mailto:support@hellope.co.in"
                                className="text-blue-600 hover:underline"
                            >
                                support@hellope.co.in
                            </a>
                        </div>

                        <div className="leading-6 xl:leading-5">
                            <span className="font-semibold">
                                🚀 Integration Support:
                            </span>{" "}
                            Sandbox setup, Production onboarding, Webhooks, API troubleshooting, and Payment Gateway assistance.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}