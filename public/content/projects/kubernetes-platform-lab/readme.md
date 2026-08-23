# Kubernetes Platform Lab

**AWS EC2 · kubeadm · Cilium · RBAC** — 2026

A multi-node Kubernetes cluster built from scratch with `kubeadm` on EC2,
rather than a managed control plane. The point was to stand in front of every
piece EKS normally hides, as preparation for the CKA.

## What it covers

| Area | Detail |
|------|--------|
| Control plane | Bootstrap, `kubeadm init`/`join`, static pods, etcd |
| Certificates | Cluster PKI, rotation, kubeconfig generation |
| Access control | RBAC roles, bindings, service accounts |
| Networking | Cilium CNI, NetworkPolicy enforcement |
| Storage | StorageClass, PersistentVolume, PersistentVolumeClaim |
| Operations | Node lifecycle, upgrades, cluster troubleshooting |

## Why build it by hand

Running EKS in production teaches you how to *operate* a cluster. It does not
teach you what breaks underneath it — which is exactly what you need when a
node goes `NotReady` at an inconvenient hour.

Building the control plane manually meant hitting the real failure modes:
expired certificates, misconfigured CNI, RBAC rules that were too permissive
in one direction and too tight in another. Those are much cheaper lessons in a
lab than in production.

> The most useful outcome wasn't the running cluster. It was knowing which
> component to suspect first when one stops behaving.
