using System;
using System.Collections.Generic;
using System.Linq;
using AForge.Math;
using AForge.Math.Metrics;

namespace Previsione
{
    class Prediction 
    {
        private List<int> values;
        public Prediction(List<int> val)
        {
            this.values = val;
        }

        private List<double> pearson()
        {
            PearsonCorrelation cor = new PearsonCorrelation();
            List<double> rets = new List<double>();
            int totElem = values.Count - 12;
            double[] orig = new double[totElem];
            double[] sfas;
            for(int i = 0; i < orig.Length; i++)
            {
                orig[i] = values[i+12];
            }

            for(int gap = 1; gap < 13; gap++)
            {
                sfas = new double[totElem];
                for(int i = 0; i < sfas.Length; i++)
                {
                    sfas[i] = values[i + 12 - gap];
                }
                //ndouble sim = cor.GetSimilarityScore(orig, sfas);
                //rets.Add(sim);
            }

            return rets;

        }

        public Tuple<int, Double> predict()
        {
            List<double> similarita = pearson();
            int max = 0;
            for (int i = 0; i < similarita.Count; i++)
            {
                if (similarita[i] > similarita[max])
                    max = i;
            }
            int stag = (max + 1);


            Console.WriteLine("Stagionalità = " + stag);

            var ma = new Dictionary<int, double>();
            var cma = new Dictionary<int, double>();
            var sr = new Dictionary<int, double>();
            var dest = new List<double>();
            var avgVal = new Dictionary<int, double>();
            var window = new List<double>();

            for (int i  = 0; i < values.Count; i++)
            {
                window.Add(values[i]);
                if (window.Count == stag)
                {
                    double sum = 0;
                    foreach (double v in window)
                    {
                        sum += v;
                    }
                    var avg = sum / stag;
                    ma.Add((i - (stag/2-1)), avg);
                    //Console.WriteLine(i-2);
                    //Console.WriteLine(avg);
                    window.Remove(window[0]);
                }
            }

            if (stag % 2 == 0)
            {
                window = new List<double>();
                for (int i = 0; i < ma.Count - 1; i++)
                {
                    window.Add(ma.ElementAt(i).Value);
                    var avg = (ma.ElementAt(i).Value + ma.ElementAt(i + 1).Value) / 2;

                    //Console.WriteLine(ma.ElementAt(i).Key);
                    cma.Add(ma.ElementAt(i).Key, avg);

                    //Console.WriteLine(avg);
                }
            } else {
                cma = ma;
            }

            for (int i = 0; i < cma.Count; i++)
            {
                var v = values[cma.ElementAt(i).Key] / cma.ElementAt(i).Value;
                sr.Add(cma.ElementAt(i).Key, v);
                //Console.WriteLine(v);
            }

            /*for (int i = 0; i < sr.Count - 6; i++)
            {
                var sum = sr.ElementAt(i).Value 
            }*/

            List<Double> avgs = new List<double>();
            var start = stag / 2;
            for(int i = 0; i < stag; i++)
            {
                //Console.WriteLine("Media " + i);
                int count = 0;
                double app = 0;
                for(int v = start; v < sr.Count; v+=stag) {
                    //Console.WriteLine("Aggiunto il valore " + v);
                    app += sr.ElementAt(v).Value;
                    count++;
                }
                avgs.Add(app / count);
                start++;
                var news = start % stag;
                start = news;
            }

            /*Console.WriteLine(avgs[0]);
            Console.WriteLine(avgs[1]);
            Console.WriteLine(avgs[2]);
            Console.WriteLine(avgs[3]);
            Console.WriteLine(avgs[4]);
            Console.WriteLine(avgs[5]);*/


            for(int i = 0; i < values.Count; i++)
            {
                int idx = i % avgs.Count;
                dest.Add(values[i] / avgs[idx]);
                //Console.WriteLine(dest[i]);
            }

            var yMedia = dest.Average();
            //Console.WriteLine("Y media = " + yMedia);

            var xMedia = (dest.Count+1) / 2;
            //Console.WriteLine("X media = " + xMedia);

            var sumCodev = 0.0;
            var sumDev = 0.0;
            for(int i = 0; i < dest.Count; i++)
            {
                sumCodev += (((i + 1) - xMedia) * (dest[i] - yMedia));
                sumDev += Math.Pow(((i + 1) - xMedia), 2);
            }

            //Console.WriteLine("Sum codev = " + sumCodev);
            //Console.WriteLine("Sum dev = " + sumDev);
            var coeReg = sumCodev / sumDev;
            Console.WriteLine("Coe reg = " + coeReg);

            var intercetta = yMedia - (coeReg * xMedia);
            Console.WriteLine("Intercetta = " + intercetta);

            var newIndex = dest.Count + 1;
            var trendNew = intercetta + (coeReg * newIndex);
            Console.WriteLine("Trend " + newIndex + " = " + trendNew);

            //Console.WriteLine("quello che prediamo + " + (newIndex % 6) + " cioè " + avgs[newIndex % 6]);
            var prev = trendNew * avgs[(newIndex-1) % avgs.Count];
            Console.WriteLine("PREVISIONE = " + prev);

            return Tuple.Create(newIndex,prev);
        }
    }
}
