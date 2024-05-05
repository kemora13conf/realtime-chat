export default function EmptyChat (){
    return (
      <div className="w-full flex flex-col gap-[10px] justify-center items-center">
        <div className="font-bold text-quaternary-400 font-['Montserrat'] md:text-2xl">
          No chat opened!
        </div>
        <div className="font-light text-sm text-center text-tertiary-500 max-w-[300px]">
          Tap on a user in the side bar to start a conversation.
        </div>
      </div>
    );
}