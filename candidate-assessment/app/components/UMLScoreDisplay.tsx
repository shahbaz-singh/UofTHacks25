interface UMLScore {
    "Class Representations:": string;
    "Relationships": string;
    "Access Modifiers": string;
}

export default function UMLScoreDisplay({ feedback }: { feedback: string }) {
    let scores: UMLScore | null = null;
    
    try {
        scores = JSON.parse(feedback) as UMLScore;
    } catch (e) {
        return null;
    }

    if (!scores) return null;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-3">UML Evaluation Scores</h3>
            {Object.entries(scores).map(([category, score]) => (
                <div key={category} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span>{category}</span>
                        <span>{score}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${score}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
} 