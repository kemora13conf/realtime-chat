export default function Loading(){
    // Retur a modern well animated loading screen with rotating circles one after the other
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-primary">
            <div className="flex flex-col gap-3 max-w-md w-full h-fit p-4">
                <h1 className="text-2xl font-bold text-center text-tertiary">Loading</h1>
                <div className="flex flex-col gap-2 ">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-tertiary wait"></div>
                        <div className="w-5 h-5 rounded-full bg-tertiary wait-500"></div>
                        <div className="w-5 h-5 rounded-full bg-tertiary wait-1000"></div>
                    </div>
                </div>
            </div>
        </div>
    )
} 