from django.shortcuts import render

PROJECT_TITLE = 'Simulation and Analysis of Drug Distribution in the Human Body using Transform-Based Mathematical Modeling'

def home(request):
    return render(request, 'simulation/home.html', {'title': PROJECT_TITLE})

def simulation(request):
    return render(request, 'simulation/simulation.html', {'title': PROJECT_TITLE})

def methodology(request):
    return render(request, 'simulation/methodology.html', {'title': PROJECT_TITLE})

def report(request):
    modules = [
        {
            'module': 'Vector Calculus Modeling of Drug Distribution',
            'requirement': 'Apply vector calculus ideas to represent spatial drug movement and region-wise flow.',
            'task': 'Model drug movement using concentration gradient, diffusion, and directional flow.',
            'parameters': 'Concentration C, gradient idea, flow strength, spatial grid coordinates, body regions.',
            'outcome': 'Visual understanding of how drug concentration spreads through body regions.',
            'techniques': 'Gradient concept, divergence concept, grid-based numerical simulation.'
        },
        {
            'module': 'Transform-Based Drug Kinetics Analysis',
            'requirement': 'Use transform-based mathematical modeling concepts to analyze concentration change over time.',
            'task': 'Simulate absorption, distribution, and elimination using time-step concentration updates.',
            'parameters': 'Dosage, diffusion rate, elimination rate, time step, concentration level.',
            'outcome': 'Real-time concentration dashboard showing stomach, blood, brain, and liver concentration.',
            'techniques': 'Differential model idea, Laplace transform interpretation, numerical simulation.'
        }
    ]
    return render(request, 'simulation/report.html', {'title': PROJECT_TITLE, 'modules': modules})
