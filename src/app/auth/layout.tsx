import "../globals.css";

export default function LoginLayout({
    children,
} : Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body>
                <div className="w-[80%] flex min-h-screen mx-auto">
                    {children}
                </div>
            </body>
        </html>
        
    )
}