type Props = {
title: string;
value: string;
};

function StatCard({ title, value }: Props) {


return (

    <div className="
        flex-1
        min-w-[220px]

        bg-[#0d1222]
        border
        border-[#182033]

        rounded-3xl
        p-6

        transition-all
        duration-300
        cursor-default

        hover:border-blue-500/20
        hover:bg-[#0f1527]
        hover:shadow-xl
        hover:shadow-black/20

        group
    ">

        <p className="
            text-sm
            font-medium
            text-slate-400
            tracking-wider
            uppercase
        ">
            {title}
        </p>

        <h2 className="
            mt-3
            text-4xl
            font-semibold
            text-white
            tracking-tight

            group-hover:text-blue-400

            transition-colors
            duration-300
        ">
            {value}
        </h2>

    </div>

);


}

export default StatCard;
